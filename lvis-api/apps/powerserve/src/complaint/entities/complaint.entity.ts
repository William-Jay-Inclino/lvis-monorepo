import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ComplaintDetail } from '../../complaint_detail/entities/complaint_detail.entity';
import { ComplaintLog } from '../../complaint_log/entities/complaint_log.entity';
import { Task } from '../../task/entities/task.entity';
import { ComplaintReportType } from '../../complaint_report_type/entities/complaint_report_type.entity';
import { NatureOfComplaint } from '../../nature_of_complaint/entities/nature_of_complaint.entity';
import { ComplaintStatus } from '../../complaint_status/entities/complaint_status.entity';
import { ComplaintAssignment } from '../../complaint_assignment/entities/complaint_assignment.entity';

@ObjectType()
export class Complaint {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  report_type_id: number;

  @Field()
  nature_of_complaint_id: string;

  @Field(() => Int)
  complaint_status_id: number;

  @Field()
  ref_number: string;

  @Field()
  complainant_name: string;

  @Field()
  complainant_contact_no: string;

  @Field()
  description: string;

  @Field()
  remarks: string;

  @Field()
  created_at: string;



  // =========== relationships ===========  

  @Field(() => ComplaintDetail, { nullable: true })
  complaint_detail: ComplaintDetail | null;

  @Field(() => ComplaintAssignment, { nullable: true })
  assigned_to: ComplaintAssignment | null;

  @Field(() => [ComplaintLog])
  logs: ComplaintLog[];

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => ComplaintReportType)
  report_type: ComplaintReportType;

  @Field(() => NatureOfComplaint)
  nature_of_complaint: NatureOfComplaint;

  @Field(() => ComplaintStatus)
  status: ComplaintStatus;

}
