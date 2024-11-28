import { Module } from '@nestjs/common';
import { EmployeeResolver } from './employee.resolver';
import { HttpModule } from '@nestjs/axios';
import { PendingModule } from '../pending/pending.module';

@Module({
  imports: [HttpModule, PendingModule],
  providers: [
    EmployeeResolver,
  ],
})
export class EmployeeModule { }
