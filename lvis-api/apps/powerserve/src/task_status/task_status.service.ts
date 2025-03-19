import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { TaskStatus } from 'apps/powerserve/prisma/generated/client';
import { TASK_STATUS } from '../task/entities/constants';

@Injectable()
export class TaskStatusService {

    private readonly logger = new Logger(TaskStatusService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<TaskStatus[]> {  

        try {
            
            const items = await this.prisma.taskStatus.findMany({
                orderBy: {
                    id: 'asc'
                }
            })
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


    async get_total_status(payload: {
        status_id: TASK_STATUS;
        assignee_id?: string;
    }) {
        const { status_id, assignee_id } = payload;
    
        const where: any = {
            status: {
                id: status_id
            }
        };
    
        if (assignee_id) {
            where.assignee_id = assignee_id;
        }
    
        return await this.prisma.task.count({ where });
    }

}
