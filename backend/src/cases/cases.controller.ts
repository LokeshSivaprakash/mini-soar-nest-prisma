import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasesService } from './cases.service';
import { Body, Post, Req } from '@nestjs/common';
import { AddNoteDto } from './dto/add-note.dto';
import { RequestActionDto } from './dto/request-action.dto';
import { Query } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private cases: CasesService) {}

  @Post(':id/notes')
addNote(@Param('id') id: string, @Body() dto: AddNoteDto, @Req() req: any) {
  return this.cases.addNote(id, req.user.userId, dto.note);
}

@Post(':id/actions')
requestAction(@Param('id') id: string, @Body() dto: RequestActionDto, @Req() req: any) {
  return this.cases.requestAction(id, req.user.userId, dto.actionType, dto.target);
}


  @Get()
  list(@Query('page') page = '1',
  @Query('limit') limit = '20',
) {
  return this.cases.listCases(Number(page), Number(limit));
}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.cases.getCaseById(id);
  }
}
