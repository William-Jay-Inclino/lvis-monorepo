import { Field, ObjectType } from "@nestjs/graphql";
import { Complaint } from "./complaint.entity";

@ObjectType()
export class MutationComplaintResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Complaint, { nullable: true })
  data?: Complaint | null;
}