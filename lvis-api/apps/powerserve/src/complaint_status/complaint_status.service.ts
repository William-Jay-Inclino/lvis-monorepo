import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ComplaintStatus } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class ComplaintStatusService {

    private readonly logger = new Logger(ComplaintStatusService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ComplaintStatus[]> {  

        try {
            
            const items = await this.prisma.complaintStatus.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() complaint_status', error)            
        }

    }

    async findOne(id: number): Promise<ComplaintStatus | null> {
        
        try {
            
            const item = await this.prisma.complaintStatus.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('ComplaintStatus not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() complaint_status', error)
        }

    }

}
