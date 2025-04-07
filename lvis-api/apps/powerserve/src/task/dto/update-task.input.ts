import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { PowerInterruptionSubInput } from './power-interruption.sub.input';
import { Type } from 'class-transformer';
import { KwhMeterSubInput } from './kwh-meter.sub.input';
import { LineServicesSubInput } from './line-services.input';
import { DlesSubInput } from './dles.sub.input';
import { LmdgaSubInput } from './lmdga.input';
import { CreateTaskFilesSubInput } from './create-task-files.sub.input';

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

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    status_id: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    action_taken: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    accomplishment: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string | null;

    @Field()
    @IsDateString()
    @IsNotEmpty()
    acted_at: string;

    @Field(() => [CreateTaskFilesSubInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTaskFilesSubInput)
    attachments: CreateTaskFilesSubInput[];

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
