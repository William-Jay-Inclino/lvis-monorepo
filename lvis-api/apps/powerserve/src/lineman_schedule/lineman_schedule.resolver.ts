import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LinemanScheduleService } from './lineman_schedule.service';
import { LinemanSchedule } from './entities/lineman_schedule.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { MutationLinemanScheduleResponse } from './entities/mutation-lineman-schedule-response';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UpdateLinemanScheduleInput } from './dto/update-lineman_schedule.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { LinemanScheduleLog } from '../lineman_schedule_log/entities/lineman_schedule_log.entity';
@UseGuards(GqlAuthGuard)
@Resolver(() => LinemanSchedule)
export class LinemanScheduleResolver {

    private readonly logger = new Logger(LinemanScheduleResolver.name);
    private filename = 'lineman_schedule.resolver.ts'

    constructor(
        private readonly schedService: LinemanScheduleService,
        private readonly audit: PowerserveAuditService,
        
    ) {}

    @Mutation(() => MutationLinemanScheduleResponse)
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.LINEMAN_SCHEDULE, RESOLVERS.updateLinemanSchedule)
    async update_lineman_schedule(
        @Args('input') input: UpdateLinemanScheduleInput,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Updating lineman schedule...', {
            username: authUser.user.username,
            filename: this.filename,
            input: JSON.stringify(input)
        })

        try {
            
            const x = await this.schedService.update({
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
            this.logger.error('Error in updating lineman schedule', error)
        }

    }

    @Query(() => [LinemanScheduleLog])
    async lineman_schedule_logs(@Args('lineman_id') lineman_id: string) {
        try {
            return await this.schedService.get_logs({ lineman_id })
        } catch (error) {
            this.logger.error('Error in getting linemen schedule logs', error);
            throw error;
        }
    }
    
}
