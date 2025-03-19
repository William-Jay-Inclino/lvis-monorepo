import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ComplaintStatus } from '../../complaint_status/entities/complaint_status.entity';

@ObjectType()
export class ComplaintLog {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  complaint_id: number;

  @Field(() => Int)
  complaint_status_id: number;

  @Field({ nullable: true })
  remarks?: string | null;

  @Field()
  created_by: string;

  @Field()
  created_at: string;

  // =========== relationships ===========  

  @Field(() => ComplaintStatus)
  status: ComplaintStatus;

}
