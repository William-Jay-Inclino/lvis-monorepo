import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateStationInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;
}
