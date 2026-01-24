import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    event: string;
    eventType: string;
    entityType: string;
    actorId: string;
    metadata: any;
    entityId?: string | null;
    before?: any;
    after?: any;
    ipAddr?: string | null;
  }) {
    const { event, eventType, entityType, actorId, metadata, entityId, before, after, ipAddr } = params;

    return this.prisma.auditLog.create({
      data: {
        event,
        eventType,
        entityType,
        actorId,
        metadata,
        entityId: entityId ?? null,
        before: before ?? undefined,
        after: after ?? undefined,
        ipAddr: ipAddr ?? null,
      },
    });
  }
}
