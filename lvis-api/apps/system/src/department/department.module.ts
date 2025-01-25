import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [SystemAuditModule],
  providers: [DepartmentResolver, DepartmentService, WinstonLoggerService],
})
export class DepartmentModule {}
