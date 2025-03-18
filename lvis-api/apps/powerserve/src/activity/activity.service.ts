import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Activity } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class ActivityService {

    private readonly logger = new Logger(ActivityService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Activity[]> {  

        try {
            
            const items = await this.prisma.activity.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() activity', error)            
        }

    }

    async findOne(id: string): Promise<Activity | null> {
        
        try {
            
            const item = await this.prisma.activity.findUnique({
                where: { id },
                include: {
                  category: true
                }
            })
    
            if (!item) {
                throw new NotFoundException('Activity not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() activity', error)
        }

    }

}
