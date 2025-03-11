import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";

@ObjectType()
export class TaskDetailDles {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field()
    lineman_incharge_id: string;

    @Field(() => Int)
    distance_travel_in_km: number;

    @Field()
    sco_number: string;

    @Field()
    old_serial_number: string;

    @Field()
    new_serial_number: string;

    @Field()
    seriv_number: string;

    @Field()
    kva_rating: string;

    @Field()
    cause: string;



    // =========== relationships ===========  

    @Field(() => Lineman)
    lineman: Lineman

    @Field(() => Task)
    task: Task

}
