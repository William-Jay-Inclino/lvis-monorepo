import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class LmdgaSubInput {

    @Field(() => [String])
    @IsArray()
    @ArrayNotEmpty()
    linemen_incharge_ids: string[];

    @Field()
    @IsNotEmpty()
    @IsString()
    kva_rating: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    substation_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    dt_location: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    feeder_id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    phase_number: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    number_of_hc: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    number_of_spans: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    copper_aluminum_primary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    copper_aluminum_secondary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    copper_aluminum_ground: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    size_primary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    size_secondary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    size_ground: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    terminal_connector_primary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    terminal_connector_secondary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    terminal_connector_ground: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    tap_position: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    brand: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    number_of_bushing_primary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    number_of_bushing_secondary: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    protective_device: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    load_current_sec_bushing: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    load_current_neutral: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    load_current_one: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    load_current_two: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    voltage_level_one: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    voltage_level_two: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    sec_line_conductor_size_one: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    sec_line_conductor_size_two: string;

}