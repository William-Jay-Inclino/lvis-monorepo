import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Employee } from './entities/employee.entity';
import { Pending } from '../pending/entities/pending.entity';
import { EmployeeService } from './employee.service';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Employee)
export class EmployeeResolver {

    private readonly logger = new Logger(EmployeeResolver.name);
    private filename = 'employee.resolver.ts'


    constructor(
        private readonly employeeService: EmployeeService,
    ) { }


    @ResolveField(() => [Pending])
    async pending_approvals(
        @Parent() employee: Employee,
    ) {

        try {
            return await this.employeeService.get_all_pendings(employee.id)

        } catch (error) {
            this.logger.error('Error in getting pending_approvals of Employee', error)
        }
    }

    @ResolveField(() => Int)
    async total_pending_approvals(
        @Parent() employee: Employee,
    ) {

        try {
            
            return await this.employeeService.get_total_pendings(employee.id)

        } catch (error) {
            this.logger.error('Error in getting total_pending_approvals of Employee', error)
        }

        
        
    }

}
