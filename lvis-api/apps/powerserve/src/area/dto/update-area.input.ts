import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateAreaInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  oic_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

}
