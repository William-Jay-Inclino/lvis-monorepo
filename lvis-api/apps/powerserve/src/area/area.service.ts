import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {

    private readonly logger = new Logger(AreaService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Area[]> {  

        try {
            
            const items = await this.prisma.area.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() area', error)            
        }

    }

    async findOne(id: string): Promise<Area | null> {
        
        try {
            
            const item = await this.prisma.area.findUnique({
                where: { id },
                include: {
                    linemen: true,
                    municipalities: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Area not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() area', error)
        }

    }

}
