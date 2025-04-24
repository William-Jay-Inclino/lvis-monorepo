import { ObjectType, Field } from '@nestjs/graphql';
import { Shift } from '../../shift/entities/shift.entity';
import { Lineman } from '../../lineman/entities/lineman.entity';

@ObjectType()
export class LinemanScheduleLog {

  @Field()
  id: string;

  @Field()
  lineman_id: string;

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

  @Field()
  recorded_at: string;

  @Field()
  recorded_by: string;

}
