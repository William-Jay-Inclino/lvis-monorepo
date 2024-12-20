import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
export class VehicleService {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

}
