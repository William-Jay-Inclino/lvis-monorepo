import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateBarangayInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  municipality_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

}
