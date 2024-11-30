import { Module } from '@nestjs/common';
import { EmployeeResolver } from './employee.resolver';
import { HttpModule } from '@nestjs/axios';
import { PendingModule } from '../pending/pending.module';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [
    HttpModule, 
    PendingModule
  ],
  providers: [
    EmployeeResolver,
    EmployeeService
  ],
  controllers: [
    EmployeeController
  ]
})
export class EmployeeModule { }
