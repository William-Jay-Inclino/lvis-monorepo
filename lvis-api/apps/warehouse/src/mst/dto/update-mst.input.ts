import { IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateMstInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  returned_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cwo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mwo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  jo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  remarks?: string;

}
