import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Lineman } from './entities/lineman.entity';

@Injectable()
export class LinemanService {

    private readonly logger = new Logger(LinemanService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Lineman[]> {  

        try {
            
            const items = await this.prisma.lineman.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() lineman', error)            
        }

    }

    async findOne(id: string): Promise<Lineman | null> {
        
        try {
            
            const item = await this.prisma.lineman.findUnique({
                where: { id },
                include: {
                    area: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Lineman not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() lineman', error)
        }

    }

}
