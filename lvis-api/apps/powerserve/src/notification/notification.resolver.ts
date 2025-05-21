import { Args, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

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

}
