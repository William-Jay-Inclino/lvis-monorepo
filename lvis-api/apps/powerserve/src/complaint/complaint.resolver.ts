import { Args, Resolver, Query, Int, Mutation } from '@nestjs/graphql';
import { ComplaintService } from './complaint.service';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { Complaint } from './entities/complaint.entity';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { FindAllComplaintResponse } from './entities/find-all-response';
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

@UseGuards(GqlAuthGuard)
@Resolver(() => Complaint)
export class ComplaintResolver {

    private readonly logger = new Logger(ComplaintResolver.name);
    private filename = 'complaint.resolver.ts'

    constructor(
        private readonly complaintService: ComplaintService,
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
            
            const x = await this.complaintService.updateStatusTransaction({
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
    async complaints(
        @Args('page') page: number,
        @Args('pageSize') pageSize: number,
        @Args('date', { nullable: true }) date?: string,
    ) {
        return await this.complaintService.findAll({
            page,
            pageSize,
            created_at: date
        });
    }

    @Query(() => Complaint)
    async complaint(
        @Args('id', { type: () => Int, nullable: true }) id?: number,
        @Args('ref_number', { nullable: true }) ref_number?: string,
    ) {
        return await this.complaintService.findBy({ id, ref_number })
    }

}
