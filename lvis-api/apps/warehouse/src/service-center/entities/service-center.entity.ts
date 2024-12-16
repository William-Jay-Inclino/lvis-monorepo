import { ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class ServiceCenter {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  contact_person: string;

  @Field()
  contact_number: string;

  @Field()
  remarks: string;
}
