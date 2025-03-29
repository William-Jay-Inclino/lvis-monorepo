import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskLog } from '../../task_log/entities/task_log.entity';
import { TaskFile } from '../../task_file/entities/task_file.entity';
import { Complaint } from '../../complaint/entities/complaint.entity';
import { TaskStatus } from '../../task_status/entities/task_status.entity';
import { Activity } from '../../activity/entities/activity.entity';
import { TaskDetailPowerInterruption } from '../../task_detail_power_interruption/entities/task_detail_power_interruption.entity';
import { TaskAssignment } from '../../task_assignment/entities/task_assignment.entity';
import { TaskDetailKwhMeter } from '../../task_detail_kwh_meter/entities/task_detail_kwh_meter.entity';
import { TaskDetailLineServices } from '../../task_detail_line_services/entities/task_detail_line_services.entity';
import { TaskDetailDles } from '../../task_detail_dles/entities/task_detail_dles.entity';
import { TaskDetailLmdga } from '../../task_detail_lmdga/entities/task_detail_lmdga.entity';

@ObjectType()
export class Task {

  @Field(() => Int)
  id: number;

  @Field()
  ref_number: string;

  @Field(() => Int, { nullable: true })
  complaint_id: number;

  @Field({ nullable: true })
  assignee_id: string | null;

  @Field({ nullable: true })
  activity_id: string | null;

  @Field(() => Int)
  task_status_id: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  remarks: string | null;

  @Field()
  accomplishment: string;

  @Field()
  action_taken: string;

  @Field({ nullable: true })
  acted_at: string | null;

  @Field()
  created_at: string;

  @Field()
  created_by: string;

  // =========== relationships ===========  

  @Field(() => [TaskLog])
  logs: TaskLog[];

  @Field(() => [TaskFile])
  files: TaskFile[];

  @Field(() => TaskAssignment, { nullable: true })
  task_assignment?: TaskAssignment | null

  @Field(() => Complaint, { nullable: true })
  complaint?: Complaint | null

  @Field(() => Activity, { nullable: true })
  activity?: Activity | null

  @Field(() => TaskStatus)
  status: TaskStatus

  @Field(() => TaskDetailPowerInterruption, { nullable: true })
  task_detail_power_interruption?: TaskDetailPowerInterruption | null

  @Field(() => TaskDetailKwhMeter, { nullable: true })
  task_detail_kwh_meter?: TaskDetailKwhMeter | null

  @Field(() => TaskDetailLineServices, { nullable: true })
  task_detail_line_services?: TaskDetailLineServices | null

  @Field(() => TaskDetailDles, { nullable: true })
  task_detail_dles?: TaskDetailDles | null

  @Field(() => TaskDetailLmdga, { nullable: true })
  task_detail_lmdga?: TaskDetailLmdga | null

}
