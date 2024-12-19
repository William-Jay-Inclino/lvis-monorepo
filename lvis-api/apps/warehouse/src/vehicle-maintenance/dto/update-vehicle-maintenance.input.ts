import { IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { InputType, Field, PartialType, Int, Float } from '@nestjs/graphql';
import { CreateVehicleMaintenanceInput } from './create-vehicle-maintenance.input';
import { CreateVehicleMaintenanceDetailSubInput } from './create-vehicle-maintenance-detail.sub.input';
import { Type } from 'class-transformer';

@InputType()
export class UpdateVehicleMaintenanceInput extends PartialType(CreateVehicleMaintenanceInput) {

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    vehicle_id?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    service_center_id?: string | null;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsDateString()
    service_date?: Date | null;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    service_mileage?: number | null;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsDateString()
    next_service_date?: Date | null;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    next_service_mileage?: number | null;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    cost?: number | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    performed_by?: string | null;

    @Field(() => [CreateVehicleMaintenanceDetailSubInput])
    @IsNotEmpty({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVehicleMaintenanceDetailSubInput)
    services: CreateVehicleMaintenanceDetailSubInput[];

}
