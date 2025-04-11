import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DB_TABLE } from '../../__common__/types';

@ObjectType()
export class WarehouseAudit {

    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field(() => String)
    table: DB_TABLE;

    @Field()
    action: string;

    @Field({ nullable: true })
    reference_id?: string;

    @Field({ nullable: true })
    metadata?: string;

    @Field({ nullable: true })
    ip_address?: string;

    @Field({ nullable: true })
    device_info?: string;

    @Field({ nullable: true })
    notes?: string;

    @Field(() => Date)
    created_at: Date;

}




