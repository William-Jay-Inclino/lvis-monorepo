import { IsDateString, IsNotEmpty } from 'class-validator';

export class MctSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}
