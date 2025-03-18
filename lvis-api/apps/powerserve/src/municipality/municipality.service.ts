import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Municipality } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class MunicipalityService {

    private readonly logger = new Logger(MunicipalityService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Municipality[]> {  

        try {
            
            const items = await this.prisma.municipality.findMany({
                include: {
                    barangays: {
                        include: {
                            sitios: true
                        }
                    }
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() municipality', error)            
        }

    }

    async findOne(id: string): Promise<Municipality | null> {
        
        try {
            
            const item = await this.prisma.municipality.findUnique({
                where: { id },
                include: {
                    area: true,
                    barangays: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Municipality not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() municipality', error)
        }

    }

}
