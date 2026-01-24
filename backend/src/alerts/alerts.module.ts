import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [PrismaModule, CasesModule],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService], // ✅ ADD THIS
})
export class AlertsModule {}
