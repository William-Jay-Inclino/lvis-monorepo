import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateVehicleInput } from './create-vehicle.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateVehicleInput extends PartialType(CreateVehicleInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vehicle_number: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  plate_number: string;

  @Field()
  @Field({ nullable: true })
  @IsOptional()
  rf_id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  classification_id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignee_id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDateString()
  date_acquired: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  status: number;

}
