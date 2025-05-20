import { Controller, Logger, Param, Sse } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notifications')
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private eventEmitter: EventEmitter2) {}

    @Sse('sse/:username')
    sse(@Param('username') username: string) {
        return fromEvent(this.eventEmitter, username).pipe(
            map((data) => ({ data }))
        );
    }
}
