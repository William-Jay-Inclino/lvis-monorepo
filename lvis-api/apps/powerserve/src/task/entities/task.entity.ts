import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TaskLog } from '../../task_log/entities/task_log.entity';
import { TaskFile } from '../../task_file/entities/task_file.entity';
import { Complaint } from '../../complaint/entities/complaint.entity';
import { TaskStatus } from '../../task_status/entities/task_status.entity';
import { Activity } from '../../activity/entities/activity.entity';

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

  @Field()
  remarks: string;

  @Field()
  accomplishment: string;

  @Field()
  action_taken: string;

  @Field()
  created_at: string;

  // =========== relationships ===========  

  @Field(() => [TaskLog])
  logs: TaskLog[];

  @Field(() => [TaskFile])
  files: TaskFile[];

  @Field(() => Complaint, { nullable: true })
  complaint?: Complaint | null

  @Field(() => Activity, { nullable: true })
  activity?: Activity | null

  @Field(() => TaskStatus)
  status: TaskStatus

}
