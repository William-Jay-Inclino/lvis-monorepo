import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateSerivApproverSubInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  approver_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  label_id: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  order: number;

}
