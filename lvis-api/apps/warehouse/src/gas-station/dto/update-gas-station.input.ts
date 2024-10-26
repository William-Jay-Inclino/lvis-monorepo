import { IsOptional, IsString } from 'class-validator';
import { CreateGasStationInput } from './create-gas-station.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGasStationInput extends PartialType(CreateGasStationInput) {

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  location: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  contact_number: string;

}
