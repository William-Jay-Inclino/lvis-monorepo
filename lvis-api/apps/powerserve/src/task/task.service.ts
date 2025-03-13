import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { AssignTaskInput } from './dto/assign-task.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Prisma } from 'apps/powerserve/prisma/generated/client';
import { TASK_STATUS } from './entities/constants';
import { ComplaintService } from '../complaint/complaint.service';
import { COMPLAINT_STATUS } from '../complaint/entities/constants';

@Injectable()
export class TaskService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
        private readonly complaintServices: ComplaintService,
    ) {}

    async assign_task(payload: {
        input: AssignTaskInput,
        metadata: {
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,

        },
        tx?: Prisma.TransactionClient,
    }) {

        const { input, metadata, tx } = payload 
        const { task_id, assigned_to_id, remarks, will_start } = input
        const { authUser } = metadata 

        const prismaClient = tx || this.prisma;
        let task_status_id = TASK_STATUS.ASSIGNED

        // update task assigned to
        if(!will_start) {
            await prismaClient.task.update({
                where: { id: task_id },
                data: {
                    assigned_to_id,
                    status: { connect: { id: task_status_id } }
                }
            })
        } else {

            task_status_id = TASK_STATUS.ONGOING

            const task = await prismaClient.task.update({
                where: { id: task_id },
                data: {
                    assigned_to_id,
                    status: { connect: { id: task_status_id } }
                }
            })

            // update complaint status to in progress 
            await this.complaintServices.updateStatus({
                input: {
                    complaint_status_id: COMPLAINT_STATUS.IN_PROGRESS,
                    complaint_id: task.complaint_id,
                    remarks: '',
                },
                authUser,
                tx: prismaClient as Prisma.TransactionClient,
            })
            
        }

        // create log
        const log: Prisma.TaskLogCreateInput = {
            task: { connect: { id: task_id } },
            status: { connect: { id: task_status_id } },
            remarks,
            created_by: authUser.user.username,
        }

        await prismaClient.taskLog.create({ data: log })

    }

}
