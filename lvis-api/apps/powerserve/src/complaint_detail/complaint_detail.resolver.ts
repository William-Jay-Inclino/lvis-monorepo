import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ComplaintDetailService } from './complaint_detail.service';
import { Consumer } from '../__consumer__   /entities/consumer.entity';
import { ComplaintDetail } from './entities/complaint_detail.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintDetail)
export class ComplaintDetailResolver {

    constructor(private readonly complaintDetailService: ComplaintDetailService) {}

    @ResolveField(() => Consumer, { nullable: true })
    consumer(@Parent() complaintDetail: ComplaintDetail): any {
        return null
    }

}
