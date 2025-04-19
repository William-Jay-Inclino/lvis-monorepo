import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PowerserveUnit } from '../../unit/entities/unit';
import { Barangay } from '../../barangay/entities/barangay.entity';
import { Complaint } from '../../complaint/entities/complaint.entity';
import { Remarks } from 'apps/powerserve/prisma/generated/client';
import { Remarks as RemarksEntity } from '../../remarks/entities/remarks';
import { Activity } from '../../activity/entities/activity.entity';


@ObjectType()
export class LinemanActivity {

    @Field()
    acted_at: string

    @Field(() => Activity)
    activity: Activity

    @Field(() => Int)
    accomplishment_qty: number

    @Field(() => Barangay)
    barangay: Barangay

    @Field(() => Complaint, { nullable: true })
    complaint?: Complaint | null

    @Field(() => Int)
    numerical_rating: number

    @Field(() => RemarksEntity)
    remarks: Remarks

    @Field(() => Float)
    distance_travelled_in_km: number

}
