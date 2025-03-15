import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Municipality } from '../../municipality/entities/municipality.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Barangay {

  @Field(() => ID)
  id: string;

  @Field()
  municipality_id: string;

  @Field()
  name: string;


  // relationships

  @Field(() => Municipality)
  municipality: Municipality;

}
