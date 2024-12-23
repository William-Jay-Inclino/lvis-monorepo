import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { JO } from '../../jo/entities/jo.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Division {

  @Field(() => ID)
  id: string;

}
