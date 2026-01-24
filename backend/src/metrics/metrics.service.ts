import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseStatus, ActionStatus } from '@prisma/client';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
  alerts24h,
  totalAlerts,
  totalCases,
  openCases,
  casesBySeverity,
  actionsRequested,
  actionsApproved,
  actionsExecuted,
] = await Promise.all([
  this.prisma.alert.count({ where: { createdAt: { gte: last24h } } }),
  this.prisma.alert.count(),
  this.prisma.case.count(),
  this.prisma.case.count({ where: { status: { not: CaseStatus.CLOSED } } }),
  this.prisma.case.groupBy({
    by: ['severity'],
    _count: { _all: true },
  }),
  this.prisma.action.count({ where: { status: ActionStatus.REQUESTED } }),
  this.prisma.action.count({ where: { status: ActionStatus.APPROVED } }),
  this.prisma.action.count({ where: { status: ActionStatus.EXECUTED } }),
]);



    return {
      alerts: { last24h: alerts24h, total: totalAlerts },
      cases: {
        total: totalCases,
        open: openCases,
        bySeverity: casesBySeverity.map((x) => ({ severity: x.severity, count: x._count._all })),
      },
      actions: {
        requested: actionsRequested,
        approved: actionsApproved,
        executed: actionsExecuted,
      },
      generatedAt: now.toISOString(),
    };
  }

  async sla() {
    // Mean Time to Approve (MTA) and Mean Time to Execute (MTE) in minutes
    const approved = await this.prisma.action.findMany({
      where: { approvedAt: { not: null } },
      select: { createdAt: true, approvedAt: true, executedAt: true },
      take: 500, // keep it light
      orderBy: { createdAt: 'desc' },
    });

    const mins = (a: Date, b: Date) => (b.getTime() - a.getTime()) / 60000;

    const mtaValues = approved
      .filter((x) => x.approvedAt)
      .map((x) => mins(x.createdAt, x.approvedAt as Date));

    const mteValues = approved
      .filter((x) => x.approvedAt && x.executedAt)
      .map((x) => mins(x.approvedAt as Date, x.executedAt as Date));

    const avg = (arr: number[]) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null);

    return {
      meanTimeToApproveMin: avg(mtaValues),
      meanTimeToExecuteMin: avg(mteValues),
      sampleSize: { approved: mtaValues.length, executed: mteValues.length },
      generatedAt: new Date().toISOString(),
    };
  }
}
