import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Employee } from './entities/employee.entity';
import { Pending } from '../pending/entities/pending.entity';
import { PendingService } from '../pending/pending.service';

@Resolver(() => Employee)
export class EmployeeResolver {
    constructor(
        private readonly pendingService: PendingService,
    ) { }


    @ResolveField(() => [Pending])
    async pending_approvals(@Parent() employee: Employee) {

        return this.pendingService.findPendingsByApproverId(employee.id)
        
    }

    @ResolveField(() => Int)
    async total_pending_approvals(@Parent() employee: Employee) {
        console.log('total_pending_approvals', employee);
        return this.pendingService.getTotalPendingsByApproverId(employee.id)
        
    }

}
