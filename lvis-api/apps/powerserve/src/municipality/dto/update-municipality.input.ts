import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateMunicipalityInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  area_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

}
