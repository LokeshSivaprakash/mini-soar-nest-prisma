import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('me')
export class MeController {
  @UseGuards(JwtAuthGuard)
  @Get()
  me(@Req() req: any) {
    return req.user;
  }
}
