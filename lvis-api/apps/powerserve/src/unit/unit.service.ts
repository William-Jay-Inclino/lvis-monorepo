import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveUnit } from './entities/unit';

@Injectable()
export class UnitService {

    private readonly logger = new Logger(UnitService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<PowerserveUnit[]> {  

        try {
            
            const items = await this.prisma.unit.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() unit', error)            
        }

    }

    async findOne(id: string): Promise<PowerserveUnit | null> {
        
        try {
            
            const item = await this.prisma.unit.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('unit not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() unit', error)
        }

    }

}
