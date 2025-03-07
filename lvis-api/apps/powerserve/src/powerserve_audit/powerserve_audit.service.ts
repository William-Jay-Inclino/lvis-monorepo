import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreatePowerserveAuditInput } from './dto/create-powerserve-audit.input';
import * as DeviceDetector from 'device-detector-js';
import { Prisma } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class PowerserveAuditService {
    private readonly logger = new Logger(PowerserveAuditService.name); 

    constructor(private readonly prisma: PrismaService) { }

    async createAuditEntry(payload: CreatePowerserveAuditInput, tx?: Prisma.TransactionClient): Promise<void> {
        try {
            
            const data: Prisma.AuditCreateInput = {...payload}

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
}
