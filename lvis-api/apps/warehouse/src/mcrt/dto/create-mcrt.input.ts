import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMcrtApproverSubInput } from './create-mcrt-approver.sub.input';
import { CreateMcrtItemSubInput } from './create-mcrt-item.sub.input';

@InputType()
export class CreateMcrtInput {

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mct_id: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  seriv_id: string | null;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  returned_by_id: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  note: string;

  @Field(() => [CreateMcrtApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMcrtApproverSubInput)
  approvers: CreateMcrtApproverSubInput[];

  @Field(() => [CreateMcrtItemSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMcrtItemSubInput)
  items: CreateMcrtItemSubInput[];
}
