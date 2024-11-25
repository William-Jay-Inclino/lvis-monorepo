import { IsOptional, IsString } from 'class-validator';
import { CreateStationInput } from './create-station.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStationInput extends PartialType(CreateStationInput) {
  @IsOptional()
  @IsString()
  @Field(() => String, {nullable: true})
  name?: string | null;

}
