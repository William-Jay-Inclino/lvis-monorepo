import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ComplaintReportType } from './entities/complaint_report_type.entity';

@Injectable()
export class ComplaintReportTypeService {

    private readonly logger = new Logger(ComplaintReportTypeService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ComplaintReportType[]> {  

        try {
            
            const items = await this.prisma.complaintReportType.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() complaint_report_type', error)            
        }

    }

    async findOne(id: number): Promise<ComplaintReportType | null> {
        
        try {
            
            const item = await this.prisma.complaintReportType.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('ComplaintReportType not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() complaint_report_type', error)
        }

    }

}
