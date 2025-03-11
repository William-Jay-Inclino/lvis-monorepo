import { Args, Int, Query, Resolver } from '@nestjs/graphql';
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
        private readonly task_statusService: TaskStatusService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => [TaskStatus])
    async task_statuses() {
        try {
            return await this.task_statusService.findAll();
        } catch (error) {
            this.logger.error('Error in getting task_statuss', error)
        }
    }

    @Query(() => TaskStatus)
    async task_status(@Args('id', { type: () => Int }) id: number) {
        try {
            return await this.task_statusService.findOne(id);
        } catch (error) {
            this.logger.error('Error in getting task_status', error)            
        }
    }

}
