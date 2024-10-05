import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangeMrvApproverInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  new_approver_id: string;

}
