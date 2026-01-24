import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { extractIocs } from './utils/ioc.util';
import { enrichIocsMock } from './utils/reputation.util';
import { computeRiskScore, severityFromScore } from './utils/scoring.util';
import { BadRequestException } from '@nestjs/common';
import { CasesService } from '../cases/cases.service';


@Injectable()
export class AlertsService {
 constructor(private prisma: PrismaService, private cases: CasesService) {}


  async ingestAlert(dto: CreateAlertDto) {
  const extracted = extractIocs(dto.rawPayload);

  const enrichments = enrichIocsMock(extracted);
  const riskScore = computeRiskScore(enrichments, 10);
  const severity = severityFromScore(riskScore);

  const normalized = {
    source: dto.source,
    title: dto.title,
    extracted,
    enrichments,
  };

const alert = await this.prisma.alert.create({
  data: {
    source: dto.source,
    title: dto.title,
    rawPayload: dto.rawPayload,
    extractedIocs: extracted as any,
    normalized: normalized as any,
    riskScore,
    severity: severity as any,
  },
});

if (severity === 'HIGH' || severity === 'CRITICAL') {
  await this.cases.createCaseFromAlert(
    alert.id,
    `Auto-case: ${alert.title}`,
    alert.severity,
  );
}

return alert;

}


  async getAllAlerts(page = 1, limit = 20) {
  const safePage = Number.isFinite(page) ? Math.max(page, 1) : 1;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
    }),
    this.prisma.alert.count(),
  ]);

  return { page: safePage, limit: safeLimit, total, items };
}

  async getAlertById(id: string) {
  if (!id) throw new BadRequestException('Alert id is required');
  return this.prisma.alert.findUnique({ where: { id } });
}


}
