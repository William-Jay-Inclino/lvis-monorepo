import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { VEHICLE_CLASSIFICATION, VEHICLE_STATUS } from './vehicle.enums';

@ObjectType()
export class Vehicle {

  @Field(() => ID)
  id: string;

  @Field()
  vehicle_number: string;

  @Field()
  plate_number: string;

  @Field()
  rf_id: string;

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

  @Field()
  created_by: string;

  @Field({ nullable: true })
  updated_by: string | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

}
