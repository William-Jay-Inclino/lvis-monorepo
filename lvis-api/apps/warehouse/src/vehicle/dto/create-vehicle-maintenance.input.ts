import { InputType, Field, Float } from '@nestjs/graphql';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { CreateVehicleMaintenanceDetailSubInput } from './create-vehicle-maintenance-detail.sub.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateVehicleMaintenanceInput {

    @Field()
    @IsNotEmpty()
    @IsString()
    vehicle_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    service_center_id: string;

    @Field(() => Date)
    @IsNotEmpty()
    @IsDateString()
    service_date: Date;

    @Field()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    service_mileage: string;

    @Field(() => Date)
    @IsNotEmpty()
    @IsDateString()
    next_service_date: Date;

    @Field()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    next_service_mileage: string;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @Field()
    @IsString()
    remarks: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    performed_by: string;

    @Field(() => [CreateVehicleMaintenanceDetailSubInput])
    @IsNotEmpty({ each: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVehicleMaintenanceDetailSubInput)
    services: CreateVehicleMaintenanceDetailSubInput[];

}
