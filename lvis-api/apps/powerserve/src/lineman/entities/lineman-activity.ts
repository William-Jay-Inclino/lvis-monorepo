import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Barangay } from '../../barangay/entities/barangay.entity';
import { Remarks } from 'apps/powerserve/prisma/generated/client';
import { Remarks as RemarksEntity } from '../../remarks/entities/remarks';
import { Activity } from '../../activity/entities/activity.entity';
import { Task } from '../../task/entities/task.entity';


@ObjectType()
export class LinemanActivity {

    @Field()
    acted_at: string

    @Field()
    created_at: string

    @Field(() => Activity)
    activity: Activity

    @Field(() => Float)
    accomplishment_qty: number

    @Field(() => Barangay)
    barangay: Barangay

    @Field(() => Task)
    task: Task

    @Field(() => Float)
    numerical_rating: number

    @Field(() => RemarksEntity)
    remarks: Remarks

    @Field(() => Float)
    distance_travelled_in_km: number

}
