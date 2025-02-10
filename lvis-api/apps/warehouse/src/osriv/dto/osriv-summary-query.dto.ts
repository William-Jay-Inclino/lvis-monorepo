import { IsDateString, IsOptional, IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class OsrivSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    departmentIds?: string[];

    @IsOptional()
    @IsString()
    requested_by_id?: string;

}
