import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { MeterBrand } from './entities/meter_brand.entity';

@Injectable()
export class MeterBrandService {

    private readonly logger = new Logger(MeterBrandService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<MeterBrand[]> {  

        try {
            
            const items = await this.prisma.meterBrand.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() meterBrand', error)            
        }

    }

    async findOne(id: string): Promise<MeterBrand | null> {
        
        try {
            
            const item = await this.prisma.meterBrand.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('MeterBrand not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() meterBrand', error)
        }

    }

}
