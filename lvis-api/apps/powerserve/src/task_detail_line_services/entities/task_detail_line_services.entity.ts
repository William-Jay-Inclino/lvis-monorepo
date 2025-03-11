import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";

@ObjectType()
export class TaskDetailLineServices {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field()
    lineman_incharge_id: string;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field()
    order_number: string;

    @Field()
    cause: string;

    @Field()
    mrv_number: string;

    @Field()
    seriv_number: string;

    @Field()
    mst_number: string;

    @Field()
    mcrt_number: string;



    // =========== relationships ===========  

    @Field(() => Lineman)
    lineman: Lineman

    @Field(() => Task)
    task: Task

}
