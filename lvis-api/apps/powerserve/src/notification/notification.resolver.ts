import { Args, Field, InputType, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@InputType()
export class MarkNotificationsAsReadInput {
    @Field(() => [String], { 
        description: 'Array of notification IDs to mark as read' 
    })
    notificationIds: string[];
}

@UseGuards(GqlAuthGuard)
@Resolver(() => Notification)
export class NotificationResolver {

    private readonly logger = new Logger(NotificationResolver.name);
    private filename = 'notification.resolver.ts'

    constructor(
        private readonly notificationService: NotificationService,
        private readonly audit: PowerserveAuditService,
    ) {}


    @Query(() => [Notification])
    async notifications(
        @Args('username') username: string,
    ) {
        try {
            return await this.notificationService.getNotifications({ username: username });
        } catch (error) {
            this.logger.error('Error in getting notifications', error)
        }
    }

    @Mutation(() => Int)
    @UseGuards(GqlAuthGuard)
    async markNotificationsAsRead(
        @Args('input') input: MarkNotificationsAsReadInput,
    ): Promise<number> {
        return this.notificationService.markMultipleAsRead(input.notificationIds);
    }

}
