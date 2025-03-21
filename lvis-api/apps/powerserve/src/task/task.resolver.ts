import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { Employee } from '../__employee__  /entities/employee.entity';
import { MutationTaskResponse } from './entities/mutation-task-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AssignTaskInput } from './dto/assign-task.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { FindAllTaskResponse } from './entities/find-all-response';
import { UpdateTaskStatusInput } from './dto/update-task-status.input';
import { UpdateTaskInput } from './dto/update-task.input';
@UseGuards(GqlAuthGuard)
@Resolver(() => Task)
export class TaskResolver {

    private readonly logger = new Logger(TaskResolver.name);
    private filename = 'task.resolver.ts'

    constructor(
        private readonly taskService: TaskService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Query(() => FindAllTaskResponse)
    tasks(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('created_at', { nullable: true }) created_at?: string,
        @Args('assignee_id', { nullable: true }) assignee_id?: string,
    ) {
        return this.taskService.findAll({ page, pageSize, created_at, assignee_id });
    }

    @Query(() => [Task])
    pending_tasks_by_group(
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        return this.taskService.get_pending_tasks_by_group({ authUser })
    }

    @Query(() => Task)
    async task(
         @Args('id', { type: () => Int }) id: number,
         @Args('with_task_details', { nullable: true }) with_task_details?: boolean,
        ) {
        try {
            return await this.taskService.get_task({ id, with_task_details });
        } catch (error) {
            this.logger.error('Error in getting area', error)            
        }
    }

    @ResolveField(() => Employee, { nullable: true })
    assignee(@Parent() task: Task): any {
        if(!task.assignee_id) {
            return null
        }
        return { __typename: 'Employee', id: task.assignee_id }
    }

    @Mutation(() => MutationTaskResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.TASK, RESOLVERS.assignTask)
    async assign_task(
        @Args('input') input: AssignTaskInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('assigning task...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })

        try {
            
            const x = await this.taskService.assign_task_transaction({
                input,
                metadata: {
                    ip_address,
                    authUser,
                    device_info: this.audit.getDeviceInfo(user_agent),
                }
            });
            
            this.logger.log(x.msg)

            return x

        } catch (error) {
            this.logger.error('Error in assigning task', error)
        }

    }

    @Mutation(() => MutationTaskResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.TASK, RESOLVERS.updateTask)
    async update_task(
        @Args('input') input: UpdateTaskInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('updating task...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })

        try {
            
            const x = await this.taskService.update_task_transaction({
                input,
                metadata: {
                    ip_address,
                    authUser,
                    device_info: this.audit.getDeviceInfo(user_agent),
                }
            });
            
            this.logger.log(x.msg)

            return x

        } catch (error) {
            this.logger.error('Error in updating task', error)
        }

    }

    @Mutation(() => MutationTaskResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.TASK, RESOLVERS.updateTaskStatus)
    async update_task_status(
        @Args('input') input: UpdateTaskStatusInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('updating task status...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })

        try {
            
            const x = await this.taskService.update_status_transaction({
                input,
                metadata: {
                    ip_address,
                    authUser,
                    device_info: this.audit.getDeviceInfo(user_agent),
                }
            });
            
            this.logger.log(x.msg)

            return x

        } catch (error) {
            this.logger.error('Error in updating task status', error)
        }

    }

}
