import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task } from "../../task/entities/task.entity";

@ObjectType()
export class TaskDetailLmdga {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;



    // =========== relationships ===========  

    @Field(() => Task)
    task: Task

}
