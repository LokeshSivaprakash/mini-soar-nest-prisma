import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Param } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller('alerts')
export class AlertsController {
  constructor(private alerts: AlertsService) {}

  // ✅ PUBLIC webhook (no JWT)
  @Post('webhook')
  ingest(@Body() dto: CreateAlertDto) {
    return this.alerts.ingestAlert(dto);
  }

  // ✅ PROTECTED list
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Query('page') page = '1',
  @Query('limit') limit = '20',) {
    return this.alerts.getAllAlerts(Number(page), Number(limit));
  }

  // ✅ PROTECTED get one
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.alerts.getAlertById(id);
  }
}

