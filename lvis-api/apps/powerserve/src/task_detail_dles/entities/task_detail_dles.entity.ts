import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task } from "../../task/entities/task.entity";
import { DlesLineman } from "../../td_dles_lineman/entities/dles_lineman.entity";

@ObjectType()
export class TaskDetailDles {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

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

    @Field(() => [DlesLineman])
    linemen_incharge: DlesLineman[]

    @Field(() => Task)
    task: Task

}
