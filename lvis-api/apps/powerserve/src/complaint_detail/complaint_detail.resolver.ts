import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ComplaintDetailService } from './complaint_detail.service';
import { Consumer } from '../__consumer__   /entities/consumer.entity';
import { ComplaintDetail } from './entities/complaint_detail.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { get_consumer } from '../__consumer__   /entities/consumer.api';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintDetail)
export class ComplaintDetailResolver {

    constructor(private readonly complaintDetailService: ComplaintDetailService) {}

    @ResolveField(() => Consumer, { nullable: true })
    async consumer(@Parent() complaintDetail: ComplaintDetail): Promise<Consumer | null> {
        
        if(!complaintDetail.consumer_id) {
            return null
        }

        return await get_consumer({ account_number: complaintDetail.consumer_id })

    }

}
