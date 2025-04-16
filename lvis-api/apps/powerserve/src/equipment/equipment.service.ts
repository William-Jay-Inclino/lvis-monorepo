import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Equipment } from './entities/equipment';

@Injectable()
export class EquipmentService {

    private readonly logger = new Logger(EquipmentService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Equipment[]> {  

        try {
            
            const items = await this.prisma.equipment.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() equipment', error)            
        }

    }

    async findOne(id: string): Promise<Equipment | null> {
        
        try {
            
            const item = await this.prisma.equipment.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('equipment not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() equipment', error)
        }

    }

}
