import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { ITEM_TRANSACTION_TYPE } from '../../__common__/types';
import { RrItem } from '../../rr-item/entities/rr-item.entity';
import { MRVItem } from '../../mrv-item/entities/mrv-item.entity';
import { SERIVItem } from '../../seriv-item/entities/seriv-item.entity';
import { OSRIVItem } from '../../osriv-item/entities/osriv-item.entity';
import { MCRTItem } from '../../mcrt-item/entities/mcrt-item.entity';
import { MSTItem } from '../../mst-item/entities/mst-item.entity';

@ObjectType()
export class ItemTransaction {

    @Field(() => ID)
    id: string;

    @Field()
    item_id: string;

    @Field({ nullable: true })
    rr_item_id: string | null;

    @Field({ nullable: true })
    osriv_item_id: string | null;

    @Field({ nullable: true })
    seriv_item_id: string | null;

    @Field({ nullable: true })
    mrv_item_id: string | null;

    @Field({ nullable: true })
    mcrt_item_id: string | null;

    @Field({ nullable: true })
    mst_item_id: string | null;

    @Field(() => Int)
    type: ITEM_TRANSACTION_TYPE;

    @Field(() => Int)
    quantity: number;

    @Field(() => Float)
    price: number;

    @Field()
    remarks: string;

    @Field(() => Boolean)
    is_initial: boolean;


    @Field(() => Date)
    created_at: Date;

    @Field()
    created_by: string;


    // =============== derived / resolvers =============== 

    @Field(() => RrItem, { nullable: true })
    rr_item: RrItem | null;

    @Field(() => OSRIVItem, { nullable: true })
    osriv_item: OSRIVItem | null;

    @Field(() => SERIVItem, { nullable: true })
    seriv_item: SERIVItem | null;

    @Field(() => MRVItem, { nullable: true })
    mrv_item: MRVItem | null;

    @Field(() => MCRTItem, { nullable: true })
    mcrt_item: MCRTItem | null;

    @Field(() => MSTItem, { nullable: true })
    mst_item: MSTItem | null;
    
}
