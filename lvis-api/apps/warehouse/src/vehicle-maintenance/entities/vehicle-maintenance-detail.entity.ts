import { ObjectType, Field, ID } from '@nestjs/graphql';
import { VehicleMaintenance } from './vehicle-maintenance.entity';
import { VehicleService } from '../../vehicle-service/entities/vehicle-service.entity';

@ObjectType()
export class VehicleMaintenanceDetail {

    @Field(() => ID)
    id: string;

    @Field()
    maintenance_id: string;

    @Field()
    service_id: string;

    @Field()
    note: string;

    @Field(() => VehicleMaintenance)
    vehicle_maintanance: VehicleMaintenance;  

    @Field(() => VehicleService)
    service: VehicleService;

}
