import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Feeder } from './entities/feeder.entity';

@Injectable()
export class FeederService {

    private readonly logger = new Logger(FeederService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Feeder[]> {  

        try {
            
            const items = await this.prisma.feeder.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() feeder', error)            
        }

    }

    async findOne(id: string): Promise<Feeder | null> {
        
        try {
            
            const item = await this.prisma.feeder.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('Feeder not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() feeder', error)
        }

    }

}
