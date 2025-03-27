import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";
import { MeterBrand } from "../../meter_brand/entities/meter_brand.entity";
import { KwhMeterLineman } from "../../td_kwh_meter_lineman/entities/kwh_meter_lineman.entity";

@ObjectType()
export class TaskDetailKwhMeter {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field()
    meter_number: string;

    @Field()
    meter_brand_id: string;

    @Field()
    last_reading: string;

    @Field()
    initial_reading: string;

    @Field()
    meter_class: string;



    // =========== relationships ===========  

    @Field(() => [KwhMeterLineman])
    linemen: KwhMeterLineman[]

    @Field(() => Task)
    task: Task

    @Field(() => MeterBrand)
    meter_brand: MeterBrand

}
