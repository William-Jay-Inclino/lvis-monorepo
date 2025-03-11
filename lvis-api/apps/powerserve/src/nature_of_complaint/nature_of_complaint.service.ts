import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { NatureOfComplaint } from './entities/nature_of_complaint.entity';

@Injectable()
export class NatureOfComplaintService {

    private readonly logger = new Logger(NatureOfComplaintService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<NatureOfComplaint[]> {  

        try {
            
            const items = await this.prisma.natureOfComplaint.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() nature_of_complaint', error)            
        }

    }

    async findOne(id: string): Promise<NatureOfComplaint | null> {
        
        try {
            
            const item = await this.prisma.natureOfComplaint.findUnique({
                where: { id },
                include: {
                  category: true
                }
            })
    
            if (!item) {
                throw new NotFoundException('NatureOfComplaint not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() nature_of_complaint', error)
        }

    }

}
