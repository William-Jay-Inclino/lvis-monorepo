import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { TaskStatus } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class TaskStatusService {

    private readonly logger = new Logger(TaskStatusService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<TaskStatus[]> {  

        try {
            
            const items = await this.prisma.taskStatus.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() task_status', error)            
        }

    }

    async findOne(id: number): Promise<TaskStatus | null> {
        
        try {
            
            const item = await this.prisma.taskStatus.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('TaskStatus not found with id: ', id.toString())
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() task_status', error)
        }

    }

}
