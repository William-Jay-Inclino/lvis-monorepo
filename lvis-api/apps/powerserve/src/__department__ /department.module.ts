import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DepartmentService } from './department.service';

@Module({
  imports: [HttpModule],
  providers: [DepartmentService],
  exports: [ DepartmentService ]
})
export class DepartmentModule {}
