import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateMeqsApproverSubInput } from './create-meqs-approver.sub.input';
import { CreateMeqsSupplierSubInput } from './create-meqs-supplier.sub.input';
import { CreateMeqsAttachmentSubInput } from './create-meqs-attachment.sub.input';

@InputType()
export class CreateMeqsInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  jo_id: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  rv_id: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  spr_id: string | null;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  notes: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  meqs_notes?: string | null;

  @Field(() => [CreateMeqsApproverSubInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMeqsApproverSubInput)
  approvers: CreateMeqsApproverSubInput[];

  @Field(() => [CreateMeqsSupplierSubInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMeqsSupplierSubInput)
  meqs_suppliers: CreateMeqsSupplierSubInput[];

  @Field(() => [CreateMeqsAttachmentSubInput], { nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMeqsAttachmentSubInput)
  attachments?: CreateMeqsAttachmentSubInput[] | null;

}
