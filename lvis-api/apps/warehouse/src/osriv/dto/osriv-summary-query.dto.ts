import { Transform } from 'class-transformer';
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
    @IsString({ each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    departmentIds?: string[]; 

    @IsOptional()
    @IsString()
    requested_by_id?: string; 

    @IsNotEmpty()
    @IsString()
    code: string; 

}
