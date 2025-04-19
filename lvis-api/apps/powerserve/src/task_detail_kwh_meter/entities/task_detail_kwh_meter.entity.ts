import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";
import { MeterBrand } from "../../meter_brand/entities/meter_brand.entity";
import { KwhMeterLineman } from "../../td_kwh_meter_lineman/entities/kwh_meter_lineman.entity";
import { ActivityCategoryCause } from "../../activity_category_cause/entities/activity-category-cause";
import { Barangay } from "../../barangay/entities/barangay.entity";

@ObjectType()
export class TaskDetailKwhMeter {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field({ nullable: true })
    cause_id?: string | null;

    @Field()
    barangay_id: string;

    @Field({ nullable: true })
    meter_number?: string | null;

    @Field({ nullable: true })
    meter_brand_id?: string | null;

    @Field({ nullable: true })
    last_reading: string;

    @Field({ nullable: true })
    initial_reading: string;

    @Field({ nullable: true })
    meter_class: string;



    // =========== relationships ===========  

    @Field(() => [KwhMeterLineman])
    linemen_incharge: KwhMeterLineman[]

    @Field(() => ActivityCategoryCause)
    cause: ActivityCategoryCause

    @Field(() => Barangay)
    barangay: Barangay

    @Field(() => Task)
    task: Task

    @Field(() => MeterBrand)
    meter_brand: MeterBrand

}
