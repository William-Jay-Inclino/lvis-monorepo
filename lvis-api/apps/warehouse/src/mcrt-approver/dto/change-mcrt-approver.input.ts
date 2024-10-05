import { IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangeMcrtApproverInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  new_approver_id: string;

}
