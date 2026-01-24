import { Module } from '@nestjs/common';
import { SimController } from './sim.controller';
import { SimService } from './sim.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule],
  controllers: [SimController],
  providers: [SimService],
})
export class SimModule {}
