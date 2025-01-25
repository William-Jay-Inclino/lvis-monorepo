import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionResolver } from './division.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [SystemAuditModule],
  providers: [DivisionResolver, DivisionService, WinstonLoggerService],
})
export class DivisionModule {}
