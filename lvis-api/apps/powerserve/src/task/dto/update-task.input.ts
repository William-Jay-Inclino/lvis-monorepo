import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { PowerInterruptionSubInput } from './power-interruption.sub.input';
import { Type } from 'class-transformer';
import { KwhMeterSubInput } from './kwh-meter.sub.input';
import { LineServicesSubInput } from './line-services.input';
import { DlesSubInput } from './dles.sub.input';
import { LmdgaSubInput } from './lmdga.input';

@InputType()
export class UpdateTaskInput {

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    task_id: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    activity_id: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    status_id?: number | null;

    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    action_taken: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

    @Field()
    @IsDateString()
    @IsNotEmpty()
    acted_at: string;

    @Field(() => PowerInterruptionSubInput, { nullable: true })
    @Type(() => PowerInterruptionSubInput)
    power_interruption: PowerInterruptionSubInput
    
    @Field(() => KwhMeterSubInput, { nullable: true })
    @Type(() => KwhMeterSubInput)
    kwh_meter: KwhMeterSubInput

    @Field(() => LineServicesSubInput, { nullable: true })
    @Type(() => LineServicesSubInput)
    line_services: LineServicesSubInput

    @Field(() => DlesSubInput, { nullable: true })
    @Type(() => DlesSubInput)
    dles: DlesSubInput

    @Field(() => LmdgaSubInput, { nullable: true })
    @Type(() => LmdgaSubInput)
    lmdga: LmdgaSubInput
}
