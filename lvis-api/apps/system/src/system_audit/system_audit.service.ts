import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/system/prisma/generated/client';
import { CreateSystemAuditInput } from './dto/create-system-audit.input';
import * as DeviceDetector from 'device-detector-js';
import { DATABASE } from '../__common__/types';

@Injectable()
export class SystemAuditService {
    private readonly logger = new Logger(SystemAuditService.name); 

    constructor(private readonly prisma: PrismaService) { }

    async createAuditEntry(payload: CreateSystemAuditInput, tx?: Prisma.TransactionClient): Promise<void> {
        try {
            
            const data: Prisma.AuditCreateInput = {...payload, database: DATABASE.SYSTEM}

            const result = tx
                ? await tx.audit.create({ data })
                : await this.prisma.audit.create({ data });

            const ctext = `audit_id=${result.id} username=${result.username} action=${result.action} table=${result.table}`;

            this.logger.log(`Audited successfully`, ctext);
        } catch (error) {
            this.logger.error('Error creating audit entry', error);
            throw error; 
        }
    }

    getDeviceInfo(userAgent: any) {
        
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);
        
        return {
            browser: device.client?.name || 'Unknown Browser',
            browserVersion: device.client?.version || 'Unknown Version',
            os: device.os?.name || 'Unknown OS',
            osVersion: device.os?.version || 'N/A',  
            device: device.device?.type || 'Unknown Device',
            deviceModel: device.device?.model || 'Unknown',  
        };
    }

    async get_audit_logs(payload: { username: string }) {
        const { username } = payload;
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const logs = await this.prisma.audit.findMany({
            select: {
                username: true,
                action: true,
                reference_id: true,
                ip_address: true,
                device_info: true,
                created_at: true, 
                metadata: true,
                notes: true,
            },
            where: { 
                username,
                created_at: { 
                    gte: threeMonthsAgo 
                }
            },
            orderBy: {
                created_at: 'desc' 
            }
        });
        
        return logs.map(i => {
            if(i.device_info) {
                i.device_info = JSON.stringify(i.device_info)
            }
            if(i.metadata) {
                i.metadata = JSON.stringify(i.metadata)
            }
            return i
        });
    }

}
