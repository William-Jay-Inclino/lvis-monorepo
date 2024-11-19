import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { UserLogEventType } from 'apps/system/prisma/generated/client';

@Injectable()
export class UserAuditLogService {

    constructor(private prisma: PrismaService) {}

    async createUserAuditLog(
        user_id: string,
        ip_address: string,
        device_info: object,  
        event_type: UserLogEventType,    
    ) {

        try {
            
            const res = await this.prisma.userAuditLog.create({
                data: {
                    user_id,
                    ip_address,
                    device_info,
                    event_type,
                },
            });

            return {
                success: true,
                msg: 'Audit log created successfully',
                data: res
            }

        } catch (error) {
            throw new HttpException(
                'Error creating user audit log',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }
    
}
