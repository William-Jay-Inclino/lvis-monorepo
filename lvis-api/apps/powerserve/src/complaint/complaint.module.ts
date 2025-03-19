import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintResolver } from './complaint.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { TaskService } from '../task/task.service';
import { AreaService } from '../area/area.service';
import { DepartmentService } from '../__department__ /department.service';
import { HttpModule } from '@nestjs/axios';
import { DivisionService } from '../__division__/division.service';

@Module({
  imports: [PowerserveAuditModule, HttpModule],
  providers: [ComplaintResolver, ComplaintService, TaskService, AreaService, DepartmentService, DivisionService],
  exports: [ ComplaintService ]
})
export class ComplaintModule {}
