import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaybookDto } from './dto/create-playbook.dto';
import { CasesService } from '../cases/cases.service';

type PlaybookStep =
  | { type: 'ADD_NOTE'; note: string }
  | { type: 'REQUEST_ACTION'; actionType: string; target: string };

@Injectable()
export class PlaybooksService {
  constructor(
    private prisma: PrismaService,
    private cases: CasesService,
  ) {}

  create(dto: CreatePlaybookDto) {
    return this.prisma.playbook.create({ data: dto });
  }

  async run(caseId: string, actorId: string) {
    const caseData = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { alert: true },
    });
    if (!caseData) throw new Error('Case not found');

    const playbook = await this.prisma.playbook.findFirst({
      where: { enabled: true, triggerSeverity: caseData.severity },
      orderBy: { createdAt: 'desc' },
    });
    if (!playbook) return { message: 'No matching playbook for this severity' };

    const steps = playbook.steps as unknown as PlaybookStep[];
    if (!Array.isArray(steps)) throw new Error('Playbook steps must be an array');

    const results: any[] = [];

    for (const step of steps) {
      if (step.type === 'ADD_NOTE') {
        const res = await this.cases.addNote(caseId, actorId, step.note);
        results.push({ step: 'ADD_NOTE', ok: true, res });
      }

      if (step.type === 'REQUEST_ACTION') {
        const res = await this.cases.requestAction(caseId, actorId, step.actionType, step.target);
        results.push({ step: 'REQUEST_ACTION', ok: true, res });
      }
    }

    return {
      message: 'Playbook executed',
      playbook: playbook.name,
      caseId,
      steps: results,
    };
  }
}
