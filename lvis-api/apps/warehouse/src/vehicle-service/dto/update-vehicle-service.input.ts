import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateVehicleServiceInput } from './create-vehicle-service.input';

@InputType()
export class UpdateVehicleServiceInput extends PartialType(CreateVehicleServiceInput) {

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

}
