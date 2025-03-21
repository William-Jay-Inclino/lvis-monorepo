import { ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class AssignedGroup {

  @Field()
  id: string;

  @Field()
  name: string;

}
