import { Args, Parent, Query, Resolver, ResolveField } from '@nestjs/graphql';
import { LinemanService } from './lineman.service';
import { Lineman } from './entities/lineman.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { Employee } from '../__employee__  /entities/employee.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Lineman)
export class LinemanResolver {

    private readonly logger = new Logger(LinemanResolver.name);
    private filename = 'lineman.resolver.ts'

    constructor(
        private readonly linemanService: LinemanService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [Lineman])
    async linemen(@Args('area_id', { type: () => String, nullable: true }) area_id?: string) {
        try {
            return await this.linemanService.findAll({ area_id });
        } catch (error) {
            this.logger.error('Error in getting linemen', error);
        }
    }

    @Query(() => [Lineman])
    async linemen_by_current_user(
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        try {
            return await this.linemanService.get_all_lineman_by_current_user({ authUser });
        } catch (error) {
            this.logger.error('Error in getting linemen_by_group', error)
        }
    }

    @Query(() => Lineman)
    async lineman(@Args('id') id: string) {
        try {
            return await this.linemanService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting lineman', error)            
        }
    }

    @ResolveField(() => Employee)
    employee(@Parent() lineman: Lineman): any {
        return { __typename: 'Employee', id: lineman.employee_id }
    }

}
