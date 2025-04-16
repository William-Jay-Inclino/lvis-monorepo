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

    @Field()
    kva_rating: string;

    @Field()
    barangay_id: string;

    @Field()
    substation_id: string;

    @Field()
    dt_location: string;

    @Field()
    feeder_id: string;

    @Field()
    phase_number: string;

    @Field()
    number_of_hc: string;

    @Field()
    number_of_spans: string;

    @Field()
    copper_aluminum_primary: string;

    @Field()
    copper_aluminum_secondary: string;

    @Field()
    copper_aluminum_ground: string;

    @Field()
    size_primary: string;

    @Field()
    size_secondary: string;

    @Field()
    size_ground: string;

    @Field()
    terminal_connector_primary: string;

    @Field()
    terminal_connector_secondary: string;

    @Field()
    terminal_connector_ground: string;

    @Field()
    tap_position: string;

    @Field()
    brand: string;

    @Field()
    number_of_bushing_primary: string;

    @Field()
    number_of_bushing_secondary: string;

    @Field()
    protective_device: string;

    @Field()
    load_current_sec_bushing: string;

    @Field()
    load_current_neutral: string;

    @Field()
    terminal_connectorload_current_one_ground: string;

    @Field()
    load_current_one: string;

    @Field()
    load_current_two: string;

    @Field()
    voltage_level_one: string;

    @Field()
    voltage_level_two: string;

    @Field()
    sec_line_conductor_size_one: string;

    @Field()
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
