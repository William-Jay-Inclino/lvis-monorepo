import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ComplaintStatus } from 'apps/powerserve/prisma/generated/client';
import { COMPLAINT_STATUS } from '../complaint/entities/constants';

@Injectable()
export class ComplaintStatusService {

    private readonly logger = new Logger(ComplaintStatusService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ComplaintStatus[]> {  

        try {
            
            const items = await this.prisma.complaintStatus.findMany({
                orderBy: {
                    id: 'asc'
                }
            })
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

    async get_total_status(payload: {
        status_id: COMPLAINT_STATUS
    }) {

        const { status_id } = payload

        return await this.prisma.complaint.count({
            where: {
                status: {
                    id: status_id
                }
            }
        })

    }

}
