// notifications.controller.ts
import { Controller, Sse, MessageEvent, Query } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('notifications')
export class NotificationsController {
  @Sse('stream')
  sse(): Observable<MessageEvent> {
    return interval(10000).pipe(
      map((_) => ({ data: { message: 'Hello world!', time: new Date().toISOString() } }))
    );
  }
}