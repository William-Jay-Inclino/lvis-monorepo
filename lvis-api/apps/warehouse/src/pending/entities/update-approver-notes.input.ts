import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateApproverNotesInput {
  @Field()
  pending_id: number;

  @Field()
  notes: string;
}