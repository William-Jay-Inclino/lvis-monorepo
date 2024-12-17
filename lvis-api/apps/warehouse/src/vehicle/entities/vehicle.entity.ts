import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { VEHICLE_CLASSIFICATION, VEHICLE_STATUS } from './vehicle.enums';
import { GasSlip } from '../../gas-slip/entities/gas-slip.entity';
import { TripTicket } from '../../trip-ticket/entities/trip-ticket.entity';
import { VehicleMaintenance } from '../../vehicle-maintenance/entities/vehicle-maintenance.entity';

@ObjectType()
export class Vehicle {

  @Field(() => ID)
  id: string;

  @Field()
  vehicle_number: string;

  @Field()
  plate_number: string;

  @Field({ nullable: true })
  rf_id: string | null;

  @Field(() => Int)
  classification_id: VEHICLE_CLASSIFICATION;

  @Field()
  assignee_id: string;

  @Field()
  name: string;

  @Field(() => Date)
  date_acquired: Date;

  @Field(() => Int)
  status: VEHICLE_STATUS;



  // =========== audit fields ===========

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;


  // =========== resolves ===========

  @Field(() => [GasSlip])
  gas_slips: GasSlip[]

  @Field(() => [TripTicket])
  trip_tickets: TripTicket[]

  @Field(() => [VehicleMaintenance])
  service_history: VehicleMaintenance[]

}
