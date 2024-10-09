import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
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
  @IsNotEmpty()
  purpose: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  or_number: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mwo_number: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  cwo_number: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  jo_number: string | null;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  consumer_name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field(() => String)
  @IsString()
  requested_by_id: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  withdrawn_by_id: string;

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
