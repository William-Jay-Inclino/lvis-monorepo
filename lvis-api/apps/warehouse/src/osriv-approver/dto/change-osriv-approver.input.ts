import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangeOsrivApproverInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  new_approver_id: string;

}
