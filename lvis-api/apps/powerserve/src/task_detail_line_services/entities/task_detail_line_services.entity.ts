import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Task } from "../../task/entities/task.entity";
import { LineServicesLineman } from "../../td_line_services_lineman/entities/line_services_lineman.entity";

@ObjectType()
export class TaskDetailLineServices {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

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

    @Field(() => [LineServicesLineman])
    linemen_incharge: LineServicesLineman[]

    @Field(() => Task)
    task: Task

}
