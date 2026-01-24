import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async createCaseFromAlert(alertId: string, title: string, severity: any) {
    return this.prisma.case.create({
      data: {
        alertId,
        title,
        severity,
        status: 'NEW',
      },
    });
  }

  async listCases(page = 1, limit = 20) {
  const safePage = Number.isFinite(page) ? Math.max(page, 1) : 1;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    this.prisma.case.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
      include: { alert: true },
    }),
    this.prisma.case.count(),
  ]);

  return { page: safePage, limit: safeLimit, total, items };
}



  async getCaseById(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      include: { alert: true, notes: true, actions: true },
    });
  }
  async addNote(caseId: string, authorId: string, note: string) {
  return this.prisma.caseNote.create({
    data: { caseId, authorId, note },
  });
}

async requestAction(caseId: string, requestedById: string, actionType: any, target: string) {
  return this.prisma.action.create({
    data: {
      caseId,
      requestedById,
      actionType,
      target,
      status: 'REQUESTED',
    },
  });
}

}
