import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSerivApproverSubInput } from './create-seriv-approver.sub.input';
import { CreateSerivItemSubInput } from './create-seriv-item.sub.input';

@InputType()
export class CreateSerivInput {

  @Field(() => Int)
  @IsString()
  request_type: number;

  @Field(() => String)
  @IsString()
  purpose: string;

  @Field(() => String)
  @IsString()
  requested_by_id: string;

  @Field(() => String)
  @IsString()
  item_from_id: string;

  @Field(() => [CreateSerivApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSerivApproverSubInput)
  approvers: CreateSerivApproverSubInput[];

  @Field(() => [CreateSerivItemSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSerivItemSubInput)
  items: CreateSerivItemSubInput[];
}
