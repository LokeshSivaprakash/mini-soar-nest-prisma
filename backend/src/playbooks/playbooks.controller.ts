import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PlaybooksService } from './playbooks.service';
import { CreatePlaybookDto } from './dto/create-playbook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('playbooks')
export class PlaybooksController {
  constructor(private playbooks: PlaybooksService) {}

  @Post()
  create(@Body() dto: CreatePlaybookDto) {
    return this.playbooks.create(dto);
  }

  @Post('run/:caseId')
  run(@Param('caseId') caseId: string, @Req() req: any) {
    return this.playbooks.run(caseId, req.user.userId); // ✅ pass real UUID
  }
}
