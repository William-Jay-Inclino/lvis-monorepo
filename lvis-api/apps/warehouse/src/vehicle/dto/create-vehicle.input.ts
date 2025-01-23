import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateVehicleInput {

  @Field()
  @IsNotEmpty()
  @IsString()
  vehicle_number: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  plate_number: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  rf_id: string | null;

  @Field()
  @IsNotEmpty()
  @IsInt()
  classification_id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  assignee_id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  date_acquired: Date;

}
