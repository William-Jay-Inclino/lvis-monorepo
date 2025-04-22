import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Barangay } from '../../barangay/entities/barangay.entity';
import { Area } from '../../area/entities/area.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Municipality {

  @Field(() => ID)
  id: string;

  @Field()
  area_id: string;

  @Field()
  name: string;


  
  // relationships

  @Field(() => [Barangay])
  barangays: Barangay[];

  @Field(() => Area)
  area: Area;

}
