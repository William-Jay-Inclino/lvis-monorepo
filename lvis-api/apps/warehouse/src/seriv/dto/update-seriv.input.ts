import { IsString, IsOptional, IsInt } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { WAREHOUSE_REQUEST_TYPE } from '../../__common__/constants';

@InputType()
export class UpdateSerivInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  purpose?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  request_type?: WAREHOUSE_REQUEST_TYPE;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  requested_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  withdrawn_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_from_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  or_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mwo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cwo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  jo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  consumer_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

}
