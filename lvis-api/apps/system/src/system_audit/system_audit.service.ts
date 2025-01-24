import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma } from 'apps/warehouse/prisma/generated/client';
import { CreateSystemAuditInput } from './dto/create-system-audit.input';
import * as DeviceDetector from 'device-detector-js';

@Injectable()
export class SystemAuditService {
    private readonly logger = new Logger(SystemAuditService.name); 

    constructor(private readonly prisma: PrismaService) { }

    async createAuditEntry(payload: CreateSystemAuditInput, tx?: Prisma.TransactionClient): Promise<void> {
        try {
            
            const result = tx
                ? await tx.audit.create({ data: payload })
                : await this.prisma.audit.create({ data: payload });

            const ctext = `audit_id=${result.id} username=${result.username} action=${result.action} table=${result.table}`;

            this.logger.log(`Audited successfully: ${ctext}`);
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
}
