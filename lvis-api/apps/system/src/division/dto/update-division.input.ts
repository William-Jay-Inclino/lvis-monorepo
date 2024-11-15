import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateDivisionInput } from './create-division.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDivisionInput extends PartialType(CreateDivisionInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  department_id?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string | null;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  permissions?: string;

}
