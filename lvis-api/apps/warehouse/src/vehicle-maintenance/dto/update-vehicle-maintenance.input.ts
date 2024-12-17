import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { CreateVehicleMaintenanceInput } from './create-vehicle-maintenance.input';

@InputType()
export class UpdateVehicleMaintenanceSubInput extends PartialType(CreateVehicleMaintenanceInput) {

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   vehicle_number: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   plate_number: string;

//   @Field()
//   @Field({ nullable: true })
//   @IsOptional()
//   rf_id: string;

//   @Field(() => Int, { nullable: true })
//   @IsOptional()
//   @IsInt()
//   classification_id: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   assignee_id: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   name: string;

//   @Field(() => Date, { nullable: true })
//   @IsOptional()
//   @IsDateString()
//   date_acquired: Date;

//   @Field(() => Int, { nullable: true })
//   @IsOptional()
//   @IsInt()
//   status: number;

}
