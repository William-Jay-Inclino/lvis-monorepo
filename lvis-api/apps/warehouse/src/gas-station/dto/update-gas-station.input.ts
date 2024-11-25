import { IsOptional, IsString } from 'class-validator';
import { CreateGasStationInput } from './create-gas-station.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGasStationInput extends PartialType(CreateGasStationInput) {

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name: string;

}
