import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MeController } from './me/me.controller';
import { AlertsModule } from './alerts/alerts.module';
import { CasesModule } from './cases/cases.module';
import { ActionsModule } from './actions/actions.module';
import { AuditModule } from './audit/audit.module';
import { SimModule } from './sim/sim.module';
import { PlaybooksModule } from './playbooks/playbooks.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AlertsModule,
    CasesModule,
    ActionsModule,
    AuditModule,
    SimModule,
    PlaybooksModule,
    MetricsModule,
  ],
  controllers: [MeController],
})
export class AppModule {}
