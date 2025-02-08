import { Controller, Post, Body } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('email')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
  ) {
    console.log('to', to);
    console.log('subject', subject);
    console.log('body', body);
    await this.messagingService.sendEmail(to, subject, body);
    return { message: 'Email sent successfully' };
  }

  @Post('chat')
  async sendChatMessage(
    @Body('to') to: string,
    @Body('message') message: string,
  ) {
    await this.messagingService.sendChatMessage(to, message);
    return { message: 'Chat message sent successfully' };
  }
}
