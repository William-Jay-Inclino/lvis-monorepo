import { Args, Resolver, Query, Int, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { ComplaintService } from './complaint.service';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Complaint } from './entities/complaint.entity';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CreateComplaintInput } from './dto/create-complaint.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { MutationComplaintResponse } from './entities/mutation-complaint-response';
import { UpdateComplaintStatusInput } from './dto/update-complaint-status.input';
import { Task } from '../task/entities/task.entity';
import { TaskService } from '../task/task.service';
import { FindAllComplaintResponse } from './entities/find-all-response';
import { AreaService } from '../area/area.service';
import { DepartmentService } from '../__department__ /department.service';
import { DivisionService } from '../__division__/division.service';
import { AssignedGroup } from './entities/assigned-group.entity';
import { ASSIGNED_GROUP_TYPE } from './entities/constants';

@UseGuards(GqlAuthGuard)
@Resolver(() => Complaint)
export class ComplaintResolver {

    private readonly logger = new Logger(ComplaintResolver.name);
    private filename = 'complaint.resolver.ts'

    constructor(
        private readonly complaintService: ComplaintService,
        private readonly areaService: AreaService,
        private readonly departmentService: DepartmentService,
        private readonly divisionService: DivisionService,
        private readonly taskService: TaskService,
        private readonly audit: PowerserveAuditService,
    ) {}

    @Mutation(() => MutationComplaintResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.COMPLAINT, RESOLVERS.createComplaint)
    async createComplaint(
        @Args('input') createComplaintInput: CreateComplaintInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Creating complaint...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(createComplaintInput)
        })

        try {
            
            const x = await this.complaintService.create({
                input: createComplaintInput,
                metadata: {
                    ip_address,
                    authUser,
                    device_info: this.audit.getDeviceInfo(user_agent),
                }
            });
            
            this.logger.log(x.msg)

            return x

        } catch (error) {
            this.logger.error('Error in creating complaint', error)
        }

    }

    @Mutation(() => MutationComplaintResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.COMPLAINT, RESOLVERS.updateComplaintStatus)
    async updateComplaintStatus(
        @Args('input') input: UpdateComplaintStatusInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating complaint status...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })

        try {
            
            const x = await this.complaintService.update_status_transaction({
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
            this.logger.error('Error in updating complaint status', error)
        }

    }

    @Query(() => FindAllComplaintResponse)
    complaints(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('created_at', { nullable: true }) created_at?: string,
    ) {
        return this.complaintService.findAll({ page, pageSize, created_at });
    }

    @Query(() => Complaint)
    async complaint(
        @Args('id', { type: () => Int, nullable: true }) id?: number,
        @Args('ref_number', { nullable: true }) ref_number?: string,
    ) {
        return await this.complaintService.findBy({ id, ref_number })
    }

    @Query(() => [Complaint])
    escalated_complaints_by_group(
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        return this.complaintService.get_escalated_complaints_by_group({ authUser })
    }

    @ResolveField(() => [Task])
    _tasks(@Parent() complaint: Complaint) {
        return this.taskService.get_tasks_by({ complaint_id: complaint.id })
    }

    @ResolveField(() => AssignedGroup, { nullable: true })
    assigned_group(
        @Parent() complaint: Complaint,
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.AREA) {
            return this.areaService.findOne(complaint.assigned_group_id)
        }

        if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DEPARTMENT) {
            return this.departmentService.get_department({ id: complaint.assigned_group_id, authUser })
        }

        if(complaint.assigned_group_type === ASSIGNED_GROUP_TYPE.DIVISION) {
            return this.divisionService.get_division({ id: complaint.assigned_group_id, authUser })
        }

        return null
    }

}
