import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Barangay } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class BarangayService {

    private readonly logger = new Logger(BarangayService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Barangay[]> {  

        try {
            
            const items = await this.prisma.barangay.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() barangay', error)            
        }

    }

    async findOne(id: string): Promise<Barangay | null> {
        
        try {
            
            const item = await this.prisma.barangay.findUnique({
                where: { id },
                include: {
                    municipality: true,
                    sitios: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Barangay not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() barangay', error)
        }

    }

}
