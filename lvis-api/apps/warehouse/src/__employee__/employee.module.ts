import { Module } from '@nestjs/common';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  providers: [
    EmployeeResolver,
    EmployeeService
  ],
  controllers: [
    EmployeeController
  ]
})
export class EmployeeModule { }
