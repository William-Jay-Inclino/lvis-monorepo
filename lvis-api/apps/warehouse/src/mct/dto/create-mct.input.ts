import { InputType, Field } from '@nestjs/graphql';
import { CreateMctApproverSubInput } from './create-mct-approver.sub.input';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

@InputType()
export class CreateMctInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  mrv_id: string;

  @Field(() => [CreateMctApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMctApproverSubInput)
  approvers: CreateMctApproverSubInput[];

}
