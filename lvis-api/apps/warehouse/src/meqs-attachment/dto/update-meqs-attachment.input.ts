import { IsOptional, IsString } from 'class-validator';
import { CreateMeqsAttachmentInput } from './create-meqs-attachment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMeqsAttachmentInput extends PartialType(CreateMeqsAttachmentInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  src?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filename?: string | null;

}
