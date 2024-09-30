import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOsrivApproverSubInput } from './create-osriv-approver.sub.input';
import { CreateOsrivItemSubInput } from './create-osriv-item.sub.input';

@InputType()
export class CreateOsrivInput {

  @Field(() => String)
  @IsString()
  purpose: string;

  @Field(() => String)
  @IsString()
  requested_by_id: string;

  @Field(() => String)
  @IsString()
  item_from_id: string;

  @Field(() => [CreateOsrivApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOsrivApproverSubInput)
  approvers: CreateOsrivApproverSubInput[];

  @Field(() => [CreateOsrivItemSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOsrivItemSubInput)
  items: CreateOsrivItemSubInput[];
}
