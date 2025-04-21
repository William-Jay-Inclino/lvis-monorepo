import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Shift } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class ShiftService {

    private readonly logger = new Logger(ShiftService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Shift[]> {  

        try {
            
            const items = await this.prisma.shift.findMany({ orderBy: { id: 'asc' } })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() shift', error)            
        }

    }

    async findOne(id: number): Promise<Shift | null> {
        
        try {
            
            const item = await this.prisma.shift.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('Shift not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() Shift', error)
        }

    }

}
