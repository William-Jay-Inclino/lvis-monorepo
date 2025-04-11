import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { SystemAuditService } from './system_audit.service';
import { SystemAudit } from './entities/system_audit.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => SystemAudit)
export class SystemAuditResolver {
    constructor(private readonly auditService: SystemAuditService) { }

    @Query(() => [SystemAudit])
    system_audit_logs(
        @Args('username') username: string,
    ) {
        return this.auditService.get_audit_logs({ username });
    }


}
