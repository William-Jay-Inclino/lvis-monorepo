import { IsDateString, IsOptional, IsEnum, IsBooleanString, isNotEmpty, IsNotEmpty, IsBoolean } from 'class-validator';

export class TripTicketSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsOptional()
    vehicleNumber?: string;

    @IsOptional()
    @IsEnum(['SV', 'VH'], { message: 'vehicleType must be either SV or VH' })
    vehicleType?: 'SV' | 'VH';

    @IsOptional()
    @IsBooleanString()
    allVehicles?: string;
}
