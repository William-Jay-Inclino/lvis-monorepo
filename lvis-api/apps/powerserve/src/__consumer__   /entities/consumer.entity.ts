import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Consumer {

    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    meter_number: string

}
