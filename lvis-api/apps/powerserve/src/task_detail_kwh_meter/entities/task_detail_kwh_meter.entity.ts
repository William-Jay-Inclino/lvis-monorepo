import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";
import { MeterBrand } from "../../meter_brand/entities/meter_brand.entity";

@ObjectType()
export class TaskDetailKwhMeter {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field()
    lineman_incharge_id: string;

    @Field(() => Int)
    distance_travel_in_km: number;

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

    @Field(() => Lineman)
    lineman: Lineman

    @Field(() => Task)
    task: Task

    @Field(() => MeterBrand)
    meter_brand: MeterBrand

}
