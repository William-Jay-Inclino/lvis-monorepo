import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ComplaintDetail } from '../../complaint_detail/entities/complaint_detail.entity';
import { ComplaintLog } from '../../complaint_log/entities/complaint_log.entity';
import { Task } from '../../task/entities/task.entity';
import { ComplaintReportType } from '../../complaint_report_type/entities/complaint_report_type.entity';
import { ComplaintStatus } from '../../complaint_status/entities/complaint_status.entity';
import { ASSIGNED_GROUP_TYPE } from './constants';

@ObjectType()
export class Complaint {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  report_type_id: number;

  @Field(() => Int)
  complaint_status_id: number;

  @Field(() => String)
  assigned_group_id: string;

  @Field(() => Int)
  assigned_group_type: ASSIGNED_GROUP_TYPE;

  @Field()
  ref_number: string;

  @Field()
  complainant_name: string;

  @Field()
  complainant_contact_no: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  remarks?: string | null;

  @Field()
  created_at: string;



  // =========== relationships ===========  

  @Field(() => ComplaintDetail, { nullable: true })
  complaint_detail: ComplaintDetail | null;

  @Field(() => [ComplaintLog])
  logs: ComplaintLog[];

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => ComplaintReportType)
  report_type: ComplaintReportType;

  @Field(() => ComplaintStatus)
  status: ComplaintStatus;

}
