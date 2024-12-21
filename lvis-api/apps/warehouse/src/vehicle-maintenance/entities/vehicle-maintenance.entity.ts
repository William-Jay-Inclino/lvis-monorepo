import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { ServiceCenter } from '../../service-center/entities/service-center.entity';
import { VehicleMaintenanceDetail } from './vehicle-maintenance-detail.entity';

@ObjectType()
export class VehicleMaintenance {

    @Field(() => ID)
    id: string;

    @Field()
    ref_number: string;

    @Field()
    vehicle_id: string;

    @Field()
    service_center_id: string;

    @Field(() => Date)
    service_date: Date;

    @Field(() => Int)
    service_mileage: number;

    @Field(() => Date)
    next_service_date: Date;

    @Field(() => Int)
    next_service_mileage: number;

    @Field(() => Float)
    cost: number;

    @Field()
    remarks: string;

    @Field()
    performed_by: string;

    @Field(() => Boolean)
    is_completed: boolean


    // =========== audit fields ===========

    @Field()
    created_by: string;

    @Field({ nullable: true })
    updated_by: string | null;

    @Field(() => Date)
    created_at: Date;

    @Field(() => Date)
    updated_at: Date;


    // =========== resolvers ===========

    @Field(() => Vehicle)
    vehicle: Vehicle

    @Field(() => ServiceCenter)
    service_center: ServiceCenter

    @Field(() => [VehicleMaintenanceDetail])
    services: VehicleMaintenanceDetail[]


}
