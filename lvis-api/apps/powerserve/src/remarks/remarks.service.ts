import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Remarks } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class RemarksService {

    private readonly logger = new Logger(RemarksService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Remarks[]> {  

        try {
            
            const items = await this.prisma.remarks.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() remarks', error)            
        }

    }

    async findOne(id: number): Promise<Remarks | null> {
        
        try {
            
            const item = await this.prisma.remarks.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('remarks not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() remarks', error)
        }

    }

}
