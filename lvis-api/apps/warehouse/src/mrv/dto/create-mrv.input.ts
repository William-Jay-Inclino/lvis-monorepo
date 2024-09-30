import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMrvApproverSubInput } from './create-mrv-approver.sub.input';
import { CreateMrvItemSubInput } from './create-mrv-item.sub.input';

@InputType()
export class CreateMrvInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  project_id: string;

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

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  withdrawn_by_id: string | null;

  @Field(() => String)
  @IsString()
  item_from_id: string;

  @Field(() => [CreateMrvApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMrvApproverSubInput)
  approvers: CreateMrvApproverSubInput[];

  @Field(() => [CreateMrvItemSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMrvItemSubInput)
  items: CreateMrvItemSubInput[];
}
