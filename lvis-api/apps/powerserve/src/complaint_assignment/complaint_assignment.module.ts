import { Module } from '@nestjs/common';
import { ComplaintAssignmentService } from './complaint_assignment.service';
import { ComplaintAssignmentResolver } from './complaint_assignment.resolver';

@Module({
  providers: [ComplaintAssignmentResolver, ComplaintAssignmentService],
})
export class ComplaintAssignmentModule {}
