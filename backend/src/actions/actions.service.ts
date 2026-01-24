import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ActionsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

 async approve(actionId: string, actorId: string, actorRole: string) {
  if (actorRole !== 'LEAD' && actorRole !== 'ADMIN') {
    throw new Error('Only LEAD/ADMIN can approve');
  }

  const action = await this.prisma.action.findUnique({ where: { id: actionId } });
  if (!action) throw new Error('Action not found');

  const updated = await this.prisma.action.update({
    where: { id: actionId },
    data: {
      status: 'APPROVED',
      approvedById: actorId,
      approvedAt: new Date(),
    },
  });

 await this.audit.log({
  event: 'Action executed',
  eventType: 'ACTION_EXECUTED',
  entityType: 'ACTION',
  entityId: actionId,
  actorId,
  metadata: {
    actionId,
    caseId: action.caseId,
    result: 'SUCCESS',
  },
});


  return updated;
}

async execute(actionId: string, actorId: string, actorRole: string) {
  if (actorRole !== 'LEAD' && actorRole !== 'ADMIN') {
    throw new Error('Only LEAD/ADMIN can execute');
  }

  const action = await this.prisma.action.findUnique({ where: { id: actionId } });
  if (!action) throw new Error('Action not found');
  if (action.status !== 'APPROVED') throw new Error('Action must be APPROVED before execution');

  const execution = {
    result: 'SUCCESS',
    executedAt: new Date().toISOString(),
  };

  const updated = await this.prisma.action.update({
    where: { id: actionId },
    data: { status: 'EXECUTED', executedAt: new Date() },
  });

  // ✅ FIX Case status below (Issue 3)
  await this.prisma.case.update({
    where: { id: action.caseId },
    data: { status: 'CLOSED' },
  });

  await this.audit.log({
  event: 'Action executed',
  eventType: 'ACTION_EXECUTED',
  entityType: 'ACTION',
  entityId: actionId,
  actorId,
  metadata: {
    actionId,
    caseId: action.caseId,
    result: 'SUCCESS',
  },
});


  return { ...updated, execution };
}

}
