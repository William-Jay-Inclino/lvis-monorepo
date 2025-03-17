import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskStatusService } from './task_status.service';
import { TaskStatus } from './entities/task_status.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => TaskStatus)
export class TaskStatusResolver {

    private readonly logger = new Logger(TaskStatusResolver.name);
    private filename = 'task_status.resolver.ts'

    constructor(
        private readonly service: TaskStatusService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [TaskStatus])
    async task_statuses() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error('Error in getting task_statuss', error)
        }
    }

    @Query(() => TaskStatus)
    async task_status(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting task_status', error)            
        }
    }

    @ResolveField(() => Int)
    total(@Parent() status: TaskStatus): any {
        return this.service.get_total_status({ status_id: status.id })
    }

}
