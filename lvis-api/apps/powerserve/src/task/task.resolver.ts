import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { FindAllPendingTasksResponse } from './entities/find-all-pending-tasks-response';
import { Employee } from '../__employee__  /entities/employee.entity';
@UseGuards(GqlAuthGuard)
@Resolver(() => Task)
export class TaskResolver {

    private readonly logger = new Logger(TaskResolver.name);
    private filename = 'task.resolver.ts'

    constructor(
        private readonly taskService: TaskService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => FindAllPendingTasksResponse)
    async pending_tasks() {
        return await this.taskService.get_all_pending_tasks();
    }

    @Query(() => [Task])
    async tasks_by_assignee(
        @Args('assignee_id') assignee_id: string,
    ) {
        return await this.taskService.get_all_tasks_by_assignee({ assignee_id });
    }

    @ResolveField(() => Employee, { nullable: true })
    assign_to(@Parent() task: Task): any {
        return { __typename: 'Employee', id: task.assigned_to_id }
    }

}
