import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { WinstonLoggerService } from '../__logger__/winston-logger.service';

@Module({
  providers: [EmployeeResolver, EmployeeService, WinstonLoggerService],
})
export class EmployeeModule {}
