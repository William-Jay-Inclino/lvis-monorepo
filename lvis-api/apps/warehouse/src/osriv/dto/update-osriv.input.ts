import { IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOsrivInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  purpose?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  requested_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  department_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_from_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  supervisor_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  warehouse_custodian_id?: string;

}
