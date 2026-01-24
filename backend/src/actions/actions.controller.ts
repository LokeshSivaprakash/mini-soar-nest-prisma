import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('actions')
export class ActionsController {
  constructor(private actions: ActionsService) {}
  @Roles('LEAD', 'ADMIN')
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    return this.actions.approve(id, req.user.userId, req.user.role);
  }

  @Patch(':id/execute')
  @Roles('LEAD', 'ADMIN')
  execute(@Param('id') id: string, @Req() req: any) {
    return this.actions.execute(id, req.user.userId, req.user.role);
  }
}
