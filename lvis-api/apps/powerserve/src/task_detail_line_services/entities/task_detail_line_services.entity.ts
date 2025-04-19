import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";
import { LineServicesLineman } from "../../td_line_services_lineman/entities/line_services_lineman.entity";
import { ActivityCategoryCause } from "../../activity_category_cause/entities/activity-category-cause";
import { Barangay } from "../../barangay/entities/barangay.entity";

@ObjectType()
export class TaskDetailLineServices {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field()
    cause_id: string;

    @Field()
    barangay_id: string;

    @Field({ nullable: true })
    order_number: string;

    @Field({ nullable: true })
    mrv_number: string;

    @Field({ nullable: true })
    seriv_number: string;

    @Field({ nullable: true })
    mst_number: string;

    @Field({ nullable: true })
    mcrt_number: string;



    // =========== relationships ===========  

    @Field(() => [LineServicesLineman])
    linemen_incharge: LineServicesLineman[]

    @Field(() => ActivityCategoryCause)
    cause: ActivityCategoryCause;

    @Field(() => Barangay)
    barangay: Barangay;

    @Field(() => Task)
    task: Task

}
