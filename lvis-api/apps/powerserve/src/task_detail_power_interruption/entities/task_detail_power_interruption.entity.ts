import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Lineman } from "../../lineman/entities/lineman.entity";
import { Feeder } from "../../feeder/entities/feeder.entity";
import { WeatherCondition } from "../../weather_condition/entities/weather_condition.entity";
import { Device } from "../../device/entities/device.entity";
import { Task } from "../../task/entities/task.entity";
import { PowerInterruptionLineman } from "../../td_power_interruption_lineman/entities/power_interruption_lineman.entity";
import { ActivityCategoryCause } from "../../activity_category_cause/entities/activity-category-cause";
import { Barangay } from "../../barangay/entities/barangay.entity";

@ObjectType()
export class TaskDetailPowerInterruption {

    @Field(() => Int)
    id: number;

    @Field(() => Int)
    task_id: number;

    @Field()
    feeder_id: string;

    @Field()
    barangay_id: string;

    @Field()
    cause_id: string;

    @Field()
    weather_condition_id: string;

    @Field()
    device_id: string;

    @Field()
    affected_area: string;

    @Field()
    equipment_failed: string;

    @Field()
    fuse_rating: string;



    // =========== relationships ===========  

    @Field(() => [PowerInterruptionLineman])
    linemen_incharge: PowerInterruptionLineman[]

    @Field(() => ActivityCategoryCause)
    cause: ActivityCategoryCause;

    @Field(() => Barangay)
    barangay: Barangay;

    @Field(() => Feeder)
    feeder: Feeder

    @Field(() => WeatherCondition)
    weather_condition: WeatherCondition

    @Field(() => Device)
    device: Device

    @Field(() => Task)
    task: Task

}
