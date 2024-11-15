import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDivisionInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  department_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  code: string;
  
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  permissions?: string;

}
