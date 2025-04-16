import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ActivityCategoryCause } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class ActivityCategoryCauseService {

    private readonly logger = new Logger(ActivityCategoryCauseService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ActivityCategoryCause[]> {  

        try {
            
            const items = await this.prisma.activityCategoryCause.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() activityCategoryCause', error)            
        }

    }

    async findOne(id: string): Promise<ActivityCategoryCause | null> {
        
        try {
            
            const item = await this.prisma.activityCategoryCause.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('activityCategoryCause not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() activityCategoryCause', error)
        }

    }

}
