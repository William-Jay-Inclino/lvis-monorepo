import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Municipality } from '../../municipality/entities/municipality.entity';
import { Lineman } from '../../lineman/entities/lineman.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Area {

  @Field(() => ID)
  id: string;

  @Field()
  oic_id: string;

  @Field()
  name: string;


  // relationships
  
  @Field(() => [Municipality])
  municipalities: Municipality[];

  @Field(() => [Lineman])
  linemen: Lineman[];

}
