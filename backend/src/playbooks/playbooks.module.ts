import { Module } from '@nestjs/common';
import { PlaybooksService } from './playbooks.service';
import { PlaybooksController } from './playbooks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [PrismaModule, CasesModule],
  controllers: [PlaybooksController],
  providers: [PlaybooksService],
})
export class PlaybooksModule {}
