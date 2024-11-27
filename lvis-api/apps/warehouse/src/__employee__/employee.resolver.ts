import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Canvass } from '../canvass/entities/canvass.entity';
import { Employee } from './entities/employee.entity';
import { CanvassService } from '../canvass/canvass.service';
import { Pending } from '../pending/entities/pending.entity';
import { PendingService } from '../pending/pending.service';

@Resolver(() => Employee)
export class EmployeeResolver {
    constructor(
        private readonly canvassService: CanvassService,
        private readonly pendingService: PendingService,
    ) { }

    @ResolveField(() => [Canvass])
    canvasses(@Parent() employee: Employee) {
        return this.canvassService.forEmployee(employee.id)
    }

    @ResolveField(() => [Pending])
    async pending_approvals(@Parent() employee: Employee) {

        return this.pendingService.findPendingsByApproverId(employee.id)
        
    }

    @ResolveField(() => Int)
    async total_pending_approvals(@Parent() employee: Employee) {

        return this.pendingService.getTotalPendingsByApproverId(employee.id)
        
    }

}
