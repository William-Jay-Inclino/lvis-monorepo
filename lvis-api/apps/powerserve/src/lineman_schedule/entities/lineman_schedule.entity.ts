import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Shift } from '../../shift/entities/shift.entity';
import { Lineman } from '../../lineman/entities/lineman.entity';

@ObjectType()
export class LinemanSchedule {

  @Field()
  id: string;

  @Field()
  lineman_id: string;

  @Field(() => Int)
  general_shift_id: number;

  @Field(() => Int)
  mon_shift_id: number;

  @Field(() => Int)
  tue_shift_id: number;

  @Field(() => Int)
  wed_shift_id: number;

  @Field(() => Int)
  thu_shift_id: number;

  @Field(() => Int)
  fri_shift_id: number;

  @Field(() => Int)
  sat_shift_id: number;

  @Field(() => Int)
  sun_shift_id: number;

  // relationships 

  @Field(() => Shift)
  general_shift: Shift;

  @Field(() => Shift)
  mon_shift: Shift;

  @Field(() => Shift)
  tue_shift: Shift;

  @Field(() => Shift)
  wed_shift: Shift;

  @Field(() => Shift)
  thu_shift: Shift;

  @Field(() => Shift)
  fri_shift: Shift;

  @Field(() => Shift)
  sat_shift: Shift;

  @Field(() => Shift)
  sun_shift: Shift;

  @Field(() => Lineman)
  lineman: Lineman;

}
