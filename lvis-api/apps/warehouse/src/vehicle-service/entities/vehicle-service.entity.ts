import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class VehicleService {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

}
