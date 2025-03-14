import { Field, ObjectType } from "@nestjs/graphql";
import { Task } from "./task.entity";

@ObjectType()
export class MutationTaskResponse {

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => Task, { nullable: true })
  data?: Task | null;
}