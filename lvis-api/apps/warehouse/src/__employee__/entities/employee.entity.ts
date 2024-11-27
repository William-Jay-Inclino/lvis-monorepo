import { ObjectType, Field, ID, Directive, Int } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Employee {

  @Field(() => ID)
  id: string;

  @Field(() => Int)
  total_pending_approvals: number

  // @Field()
  // firstname: string;

  // @Field({ nullable: true })
  // middlename: string | null;

  // @Field()
  // lastname: string;

  // @Field({ nullable: true })
  // position: string | null;

  // @Field(() => [RVApprover])
  // rv_pending_approvals: RVApprover[]

  // @Field(() => [MEQSApprover])
  // meqs_pending_approvals: MEQSApprover[]

  // @Field(() => [POApprover])
  // po_pending_approvals: POApprover[]

  // @Field(() => [RrApprover])
  // rr_pending_approvals: RrApprover[]

  // @Field(() => [Pending])
  // pending_approvals: Pending[]

}
