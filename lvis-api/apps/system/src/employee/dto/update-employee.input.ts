import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CreateEmployeeInput } from './create-employee.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  employee_number?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  rank_number?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name_prefix?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name_suffix?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstname?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  middlename?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastname?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  position?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  department_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  division_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  signature_src?: string;

}
