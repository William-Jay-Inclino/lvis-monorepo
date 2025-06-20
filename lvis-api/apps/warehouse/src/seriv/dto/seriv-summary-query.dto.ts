import { IsDateString, IsNotEmpty } from 'class-validator';

export class SerivSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}
