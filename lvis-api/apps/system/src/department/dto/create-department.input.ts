import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateDepartmentInput {

  @Field()
  @IsNotEmpty()
  code: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  permissions?: string;
  
}
