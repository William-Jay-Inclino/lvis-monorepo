import { ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class VehicleService {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

}
