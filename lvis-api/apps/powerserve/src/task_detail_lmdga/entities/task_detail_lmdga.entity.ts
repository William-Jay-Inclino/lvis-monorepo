import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task } from "../../task/entities/task.entity";
import { Feeder } from "../../feeder/entities/feeder.entity";
import { LineServicesLineman } from "../../td_line_services_lineman/entities/line_services_lineman.entity";
import { Barangay } from "../../barangay/entities/barangay.entity";

@ObjectType()
export class TaskDetailLmdga {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field({ nullable: true })
    kva_rating: string;

    @Field()
    barangay_id: string;

    @Field({ nullable: true })
    substation_id?: string | null;

    @Field({ nullable: true })
    dt_location: string;

    @Field({ nullable: true })
    feeder_id?: string | null;

    @Field({ nullable: true })
    phase_number: string;

    @Field({ nullable: true })
    number_of_hc: string;

    @Field({ nullable: true })
    number_of_spans: string;

    @Field({ nullable: true })
    copper_aluminum_primary: string;

    @Field({ nullable: true })
    copper_aluminum_secondary: string;

    @Field({ nullable: true })
    copper_aluminum_ground: string;

    @Field({ nullable: true })
    size_primary: string;

    @Field({ nullable: true })
    size_secondary: string;

    @Field({ nullable: true })
    size_ground: string;

    @Field({ nullable: true })
    terminal_connector_primary: string;

    @Field({ nullable: true })
    terminal_connector_secondary: string;

    @Field({ nullable: true })
    terminal_connector_ground: string;

    @Field({ nullable: true })
    tap_position: string;

    @Field({ nullable: true })
    brand: string;

    @Field({ nullable: true })
    number_of_bushing_primary: string;

    @Field({ nullable: true })
    number_of_bushing_secondary: string;

    @Field({ nullable: true })
    protective_device: string;

    @Field({ nullable: true })
    load_current_sec_bushing: string;

    @Field({ nullable: true })
    load_current_neutral: string;

    @Field({ nullable: true })
    terminal_connectorload_current_one_ground: string;

    @Field({ nullable: true })
    load_current_one: string;

    @Field({ nullable: true })
    load_current_two: string;

    @Field({ nullable: true })
    voltage_level_one: string;

    @Field({ nullable: true })
    voltage_level_two: string;

    @Field({ nullable: true })
    sec_line_conductor_size_one: string;

    @Field({ nullable: true })
    sec_line_conductor_size_two: string;


    // =========== relationships ===========  

    @Field(() => [LineServicesLineman])
    linemen_incharge: LineServicesLineman[]

    @Field(() => Task)
    task: Task

    @Field(() => Barangay)
    barangay: Barangay

    @Field(() => Feeder)
    feeder: Feeder

}
