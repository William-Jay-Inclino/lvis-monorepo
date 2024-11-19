import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserAuditLogDto } from './dto/create-user-audit-log.dto';  // Assuming a DTO is used
import { UserAuditLogService } from './user-audit-log.service';

@Controller('user-audit-log')
export class UserAuditLogController {
    constructor(private readonly userAuditLogService: UserAuditLogService) {}

    @Post()
    async createUserAuditLog(@Body() createUserAuditLogDto: CreateUserAuditLogDto) {
        const { user_id, ip_address, device_info, event_type } = createUserAuditLogDto;

        return await this.userAuditLogService.createUserAuditLog(
            user_id, ip_address, device_info, event_type
        );
    }
}
