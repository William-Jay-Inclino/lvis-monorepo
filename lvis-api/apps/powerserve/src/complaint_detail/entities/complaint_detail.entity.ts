import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Barangay } from '../../barangay/entities/barangay.entity';
import { Sitio } from '../../sitio/entities/sitio.entity';
import { Complaint } from '../../complaint/entities/complaint.entity';

@ObjectType()
export class ComplaintDetail {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  complaint_id: number;

  @Field({ nullable: true })
  consumer_id: string | null;

  @Field()
  barangay_id: string;

  @Field({ nullable: true })
  sitio_id: string | null;

  @Field({ nullable: true })
  landmark: string | null;


  // =========== relationships ===========  

  @Field(() => Barangay)
  barangay: Barangay;

  @Field(() => Complaint)
  complaint: Complaint;

  @Field(() => Sitio, { nullable: true })
  sitio: Sitio | null;

}
