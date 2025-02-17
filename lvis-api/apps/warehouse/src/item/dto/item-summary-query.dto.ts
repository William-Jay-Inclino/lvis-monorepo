import { IsDateString, IsNotEmpty } from 'class-validator';

export class ItemSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

}
