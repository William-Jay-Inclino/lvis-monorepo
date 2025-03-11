import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ComplaintCategory } from './entities/complaint_category.entity';

@Injectable()
export class ComplaintCategoryService {

    private readonly logger = new Logger(ComplaintCategoryService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ComplaintCategory[]> {  

        try {
            
            const items = await this.prisma.complaintCategory.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() complaint_category', error)            
        }

    }

    async findOne(id: number): Promise<ComplaintCategory | null> {
        
        try {
            
            const item = await this.prisma.complaintCategory.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('ComplaintCategory not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() complaint_category', error)
        }

    }

}
