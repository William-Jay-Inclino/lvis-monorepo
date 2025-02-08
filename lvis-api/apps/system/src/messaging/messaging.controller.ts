import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { AuthUser } from '../__common__/auth-user.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { DB_TABLE } from '../__common__/types';

@UseGuards(JwtAuthGuard)
@Controller('messaging')
export class MessagingController {
    
    private readonly logger = new Logger(MessagingController.name);
    private filename = 'messaging.controller.ts'

    constructor(
        private readonly messagingService: MessagingService,
        private readonly audit: SystemAuditService,
    ) {}

    @Post('email')
    async sendEmail(
        @Body('to') to: string,
        @Body('subject') subject: string,
        @Body('body') body: string,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        console.log('Sending email...');
        this.logger.log('Sending email...', {
            username: authUser.user.username,
            filename: this.filename,
            to,
            subject,
            body,
        })

        try {

            const x = await this.messagingService.sendEmail(to, subject, body);
            this.logger.log(x.msg)

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.NONE,
                action: 'SEND-EMAIL:SUCCESS',
                reference_id: 'N/A',
                metadata: {
                    'to': to,
                    'subject': subject,
                    'body': body,
                },
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
            })

            return x 

        } catch (error) {
            this.logger.error(`Failed to send email`, error)

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.NONE,
                action: 'SEND-EMAIL:ERROR',
                reference_id: 'N/A',
                metadata: {
                    'to': to,
                    'subject': subject,
                    'body': body,
                    'error': error,
                },
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
            })

        }

}

//   @Post('chat')
//   async sendChatMessage(
//     @Body('to') to: string,
//     @Body('message') message: string,
//   ) {
//     await this.messagingService.sendChatMessage(to, message);
//     return { message: 'Chat message sent successfully' };
//   }
}
