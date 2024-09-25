import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMstApproverSubInput } from './create-mst-approver.sub.input';
import { CreateMstItemSubInput } from './create-mst-item.sub.input';

@InputType()
export class CreateMstInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  returned_by_id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  cwo_number: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mwo_number: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  jo_number: string | null;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  remarks: string;

  @Field(() => [CreateMstApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMstApproverSubInput)
  approvers: CreateMstApproverSubInput[];

  @Field(() => [CreateMstItemSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMstItemSubInput)
  items: CreateMstItemSubInput[];
}
