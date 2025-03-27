import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Consumer {

    @Field(() => ID)
    id: string;

    @Field()
    name: string

    @Field()
    meter_number: string

}
