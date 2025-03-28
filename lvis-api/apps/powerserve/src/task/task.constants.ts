import { Prisma } from "apps/powerserve/prisma/generated/client";
import { UpdateTaskInput } from "./dto/update-task.input";
import { get_dles_data, get_kwh_meter_data, get_line_services_data, get_lmdga_data, get_power_interruption_data } from "./helpers/task.helpers";

type TaskDetailHandler = {
    key: keyof UpdateTaskInput;
    prismaField: keyof Prisma.TaskUpdateInput;
    handler: (data: any) => any;
};


// Define all possible task detail handlers in a configurable way
export const taskDetailHandlers: TaskDetailHandler[] = [
    {
        key: 'power_interruption',
        prismaField: 'task_detail_power_interruption',
        handler: get_power_interruption_data,
    },
    {
        key: 'kwh_meter',
        prismaField: 'task_detail_kwh_meter',
        handler: get_kwh_meter_data,
    },
    {
        key: 'line_services',
        prismaField: 'task_detail_line_services',
        handler: get_line_services_data,
    },
    {
        key: 'dles',
        prismaField: 'task_detail_dles',
        handler: get_dles_data,
    },
    {
        key: 'lmdga',
        prismaField: 'task_detail_lmdga',
        handler: get_lmdga_data,
    },
];