import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { ActivityCategory } from './entities/activity_category.entity';

@Injectable()
export class ActivityCategoryService {

    private readonly logger = new Logger(ActivityCategoryService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<ActivityCategory[]> {  

        try {
            
            const items = await this.prisma.activityCategory.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() activity_category', error)            
        }

    }

    async findOne(id: number): Promise<ActivityCategory | null> {
        
        try {
            
            const item = await this.prisma.activityCategory.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('ActivityCategory not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() activity_category', error)
        }

    }

}
