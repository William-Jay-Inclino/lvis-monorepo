import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { WarehouseAudit } from './entities/warehouse_audit.entity';
import { WarehouseAuditService } from './warehouse_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => WarehouseAudit)
export class WarehouseAuditResolver {
    constructor(private readonly auditService: WarehouseAuditService) { }

    @Query(() => [WarehouseAudit])
    warehouse_audit_logs(
        @Args('username') username: string,
    ) {
        return this.auditService.get_audit_logs({ username });
    }


}
