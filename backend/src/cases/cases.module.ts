import { Module, forwardRef } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [forwardRef(() => AlertsModule)],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
