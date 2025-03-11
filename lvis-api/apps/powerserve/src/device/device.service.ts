import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {

    private readonly logger = new Logger(DeviceService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Device[]> {  

        try {
            
            const items = await this.prisma.device.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() device', error)            
        }

    }

    async findOne(id: string): Promise<Device | null> {
        
        try {
            
            const item = await this.prisma.device.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('Device not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() device', error)
        }

    }

}
