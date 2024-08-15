import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDepartmentInput {

  @Field()
  @IsNotEmpty()
  code: string;

  @Field()
  @IsNotEmpty()
  name: string;
}
