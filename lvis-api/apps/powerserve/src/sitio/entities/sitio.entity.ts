import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Barangay } from '../../barangay/entities/barangay.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Sitio {

    @Field(() => ID)
    id: string;

    @Field()
    barangay_id: string;

    @Field()
    name: string;

    // relationships

    @Field(() => Barangay)
    barangay: Barangay;

}
