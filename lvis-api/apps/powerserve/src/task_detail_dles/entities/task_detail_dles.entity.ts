import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task } from "../../task/entities/task.entity";
import { DlesLineman } from "../../td_dles_lineman/entities/dles_lineman.entity";
import { ActivityCategoryCause } from "../../activity_category_cause/entities/activity-category-cause";
import { Barangay } from "../../barangay/entities/barangay.entity";

@ObjectType()
export class TaskDetailDles {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field()
    cause_id: number;

    @Field()
    barangay_id: number;

    @Field({ nullable: true })
    sco_number: string;

    @Field({ nullable: true })
    old_serial_number: string;

    @Field({ nullable: true })
    new_serial_number: string;

    @Field({ nullable: true })
    seriv_number: string;

    @Field({ nullable: true })
    kva_rating: string;





    // =========== relationships ===========  

    @Field(() => [DlesLineman])
    linemen_incharge: DlesLineman[]

    @Field(() => Barangay)
    barangay: Barangay;

    @Field(() => ActivityCategoryCause)
    cause: ActivityCategoryCause;

    @Field(() => Task)
    task: Task

}
