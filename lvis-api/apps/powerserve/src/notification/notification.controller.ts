import { Controller, Logger, Param, Sse } from '@nestjs/common';
import { fromEvent, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notifications')
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);
    private destroy$ = new Subject<void>();

    constructor(private eventEmitter: EventEmitter2) {}

    // @Sse('sse/:username')
    // sse(@Param('username') username: string) {
    //     return fromEvent(this.eventEmitter, username).pipe(
    //         map((data) => ({ data }))
    //     );
    // }

    @Sse('sse/:username')
    sse(@Param('username') username: string) {
        return fromEvent(this.eventEmitter, username).pipe(
            map((data) => ({ data })),
            takeUntil(this.destroy$), 
            finalize(() => console.log(`Client ${username} disconnected`))
        );
    }

}
