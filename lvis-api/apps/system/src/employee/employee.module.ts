import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [SystemAuditModule],
  providers: [EmployeeResolver, EmployeeService, WinstonLoggerService],
})
export class EmployeeModule {}
