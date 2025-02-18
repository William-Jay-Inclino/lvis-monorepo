import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class ItemTransactionSummaryQueryDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @Transform(({ value }) => 
        typeof value === 'string' 
            ? value.split(',').map(Number)  // Split and convert to numbers
            : Array.isArray(value) 
                ? value.map(Number) 
                : [Number(value)]
    )
    @IsArray()
    @IsInt({ each: true }) 
    item_type_ids: number[];

}
