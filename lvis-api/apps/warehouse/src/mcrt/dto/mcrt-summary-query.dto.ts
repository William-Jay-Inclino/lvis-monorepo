import { IsDateString, IsNotEmpty } from 'class-validator';

export class McrtSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}
