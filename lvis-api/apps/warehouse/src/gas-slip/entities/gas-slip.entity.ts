import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { GasStation } from '../../gas-station/entities/gas-station.entity';
import { FuelType } from '../../fuel-type/entities/fuel-type.entity';
import { GasSlipApprover } from '../../gas-slip-approver/entities/gas-slip-approver.entity';

@ObjectType()
export class GasSlip {

  @Field(() => ID)
  id: string;

  @Field()
  gas_slip_number: string;

  @Field()
  vehicle_id: string;

  @Field()
  driver_id: string;

  @Field( () => Int)
  gas_station_id: number;

  @Field( () => Int)
  fuel_type_id: number;

  @Field()
  requested_by_id: string;

  @Field(() => Boolean)
  with_container: boolean;

  @Field()
  liter_in_text: string;

  @Field(() => Float, { nullable: true })
  actual_liter: number | null;

  @Field(() => Float, { nullable: true })
  price_per_liter: number | null;

  @Field()
  purpose: string;

  @Field(() => Boolean, { nullable: true })
  is_posted: boolean | null;

  @Field(() => Int)
  print_count: number;

  @Field(() => Int, { nullable: true })
  approval_status: number | null;

  @Field(() => Date, { nullable: true })
  used_on: Date | null;


  
  // =============== audit fields ===============

  @Field({ nullable: true })
  cancelled_by: string | null;

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field({ nullable: true })
  cancelled_at: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;



  
  // =============== derived / resolvers ===============

  @Field(() => Vehicle)
  vehicle: Vehicle;

  @Field(() => GasStation)
  gas_station: GasStation;

  @Field(() => FuelType)
  fuel_type: FuelType;

  @Field(() => [GasSlipApprover])
  gas_slip_approvers: GasSlipApprover[];

}
