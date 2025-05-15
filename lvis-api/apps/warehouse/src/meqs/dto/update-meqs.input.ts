import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { CreateMeqsAttachmentSubInput } from './create-meqs-attachment.sub.input';
import { Type } from 'class-transformer';

@InputType()
export class UpdateMeqsInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;


  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  meqs_notes?: string | null;


  @Field(() => [CreateMeqsAttachmentSubInput], { nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMeqsAttachmentSubInput)
  attachments?: CreateMeqsAttachmentSubInput[] | null;

}
