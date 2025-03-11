import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Sitio } from './entities/sitio.entity';

@Injectable()
export class SitioService {

    private readonly logger = new Logger(SitioService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Sitio[]> {  

        try {
            
            const items = await this.prisma.sitio.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() sitio', error)            
        }

    }

    async findOne(id: string): Promise<Sitio | null> {
        
        try {
            
            const item = await this.prisma.sitio.findUnique({
                where: { id },
                include: {
                    barangay: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Sitio not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() sitio', error)
        }

    }

}
