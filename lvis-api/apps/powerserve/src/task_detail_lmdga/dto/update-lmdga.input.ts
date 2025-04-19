import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateLmdgaInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    barangay_id: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    kva_rating?: string | null;

    @Field()
    @IsNotEmpty()
    @IsString()
    substation_id: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    dt_location?: string | null;

    @Field()
    @IsNotEmpty()
    @IsString()
    feeder_id: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phase_number?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    number_of_hc?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    number_of_spans?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    copper_aluminum_primary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    copper_aluminum_secondary?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    copper_aluminum_ground?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    size_primary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    size_secondary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    size_ground?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    terminal_connector_primary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    terminal_connector_secondary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    terminal_connector_ground?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tap_position?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    brand?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    number_of_bushing_primary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    number_of_bushing_secondary?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    protective_device?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    load_current_sec_bushing?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    load_current_neutral?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    load_current_one?: string| null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    load_current_two?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    voltage_level_one?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    voltage_level_two?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sec_line_conductor_size_one?: string | null;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sec_line_conductor_size_two?: string | null;

}