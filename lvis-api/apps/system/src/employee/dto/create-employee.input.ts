import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateEmployeeInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  employee_number: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Min(50)
  rank_number: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name_prefix: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name_suffix: string | null;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  middlename?: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  position: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  department_id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  division_id?: string | null;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  signature_src?: string;

}
