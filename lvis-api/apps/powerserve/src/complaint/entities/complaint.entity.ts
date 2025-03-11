import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';

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

}
