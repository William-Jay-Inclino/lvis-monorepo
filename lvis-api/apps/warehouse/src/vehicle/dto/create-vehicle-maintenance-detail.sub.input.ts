import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateVehicleMaintenanceDetailSubInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  service_id: string;

  @Field()
  @IsString()
  note: string;
}
