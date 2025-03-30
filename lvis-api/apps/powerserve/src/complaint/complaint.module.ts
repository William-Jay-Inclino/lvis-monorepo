import { forwardRef, Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintResolver } from './complaint.resolver';
import { PowerserveAuditModule } from '../powerserve_audit/powerserve_audit.module';
import { AreaService } from '../area/area.service';
import { DepartmentService } from '../__department__ /department.service';
import { HttpModule } from '@nestjs/axios';
import { DivisionService } from '../__division__/division.service';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [PowerserveAuditModule, HttpModule, forwardRef(() => TaskModule)],
  providers: [ComplaintResolver, ComplaintService, AreaService, DepartmentService, DivisionService],
  exports: [ ComplaintService ]
})
export class ComplaintModule {}
