import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Activity, Prisma } from 'apps/powerserve/prisma/generated/client';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { CreatePowerserveActivityInput } from './dto/create-activity.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MutationPowerserveActivityResponse } from './entities/mutation-activity-response';
import { DB_TABLE } from '../__common__/types';
import { UpdatePowerserveActivityInput } from './dto/update-activity.input';

@Injectable()
export class ActivityService {

    private readonly logger = new Logger(ActivityService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreatePowerserveActivityInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationPowerserveActivityResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        const existingActivity = await this.prisma.activity.findUnique({ 
            where: {
                code: input.code
            } 
        })

        if (existingActivity) return { success: false, msg: 'Activity Code already exists' };
    
        return this.prisma.$transaction(async (tx) => {
            const created = await tx.activity.create({
                data: {
                    category: { connect: { id: input.category_id } },
                    unit: { connect: { id: input.unit_id } },
                    code: input.code,
                    name: input.name,
                    quantity: input.quantity,
                    num_of_personnel: input.num_of_personnel,
                },
                include: {
                    category: true,
                    unit: true,
                }
            });
    
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.ACTIVITY,
                action: 'CREATE-ACTIVITY',
                reference_id: created.id,
                metadata: created, 
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Activity created successfully',
                data: created
            };
        });
    }

    async update(
        id: string,
        input: UpdatePowerserveActivityInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationPowerserveActivityResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify activity exists
            const existing = await tx.activity.findUnique({ 
                where: { id },
                include: {
                    category: true,
                    unit: true,
                }
            });
            if (!existing) {
                return { success: false, msg: 'Activity not found' };
            }
    
            // 2. Check for unique constraint in code
            if (input.code && input.code !== existing.code) {
            const codeExists = await tx.activity.findFirst({
                where: {
                    code: input.code,
                    id: { not: id } // Exclude current activity from the check
                }
            });

            if (codeExists) {
                return { success: false, msg: 'Activity code already exists' };
            }
        }
    
            // 3. Perform update
            const updated = await tx.activity.update({
                where: { id },
                data: {
                    category: { connect: { id: input.category_id } },
                    unit: { connect: { id: input.unit_id } },
                    code: input.code,
                    name: input.name,
                    quantity: input.quantity,
                    num_of_personnel: input.num_of_personnel,
                },
                include: {
                    category: true,
                    unit: true,
                }
            });
    
            // 4. Audit log
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.ACTIVITY,
                action: 'UPDATE-ACTIVITY',
                reference_id: id,
                metadata: {
                    'old_value': existing,
                    'new_value': updated
                },
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Activity updated successfully',
                data: updated
            };
        });
    }

    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
        ): Promise<MutationPowerserveActivityResponse> {
        const { authUser, ip_address, device_info } = metadata;
        
        try {
            return await this.prisma.$transaction(async (tx) => {

            const existingItem = await tx.activity.findUnique({
                where: { id },
                select: { id: true }
            });
        
            if (!existingItem) {
                return { success: false, msg: "Activity not found" };
            }
        
            const relationChecks = await Promise.all([
                tx.task.findFirst({ where: { activity_id: id }, select: { id: true } }),
            ]);
        
            const hasRelations = relationChecks.some((relation) => relation !== null);
        
            if (hasRelations) {
                return {
                    success: false,
                    msg: "Unable to delete: Activity has existing records"
                };
            }
        
            // Proceed with deletion
            const deletedItem = await tx.activity.delete({
                where: { id },
            });
        
            // Audit log
            await this.audit.createAuditEntry(
                {
                    username: authUser.user.username,
                    table: DB_TABLE.ACTIVITY,
                    action: "DELETE-ACTIVITY",
                    reference_id: id,
                    metadata: deletedItem,
                    ip_address,
                    device_info
                },
                tx as unknown as Prisma.TransactionClient
            );
        
            return { success: true, msg: "Activity successfully deleted" };
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { success: false, msg: "Database error during deletion" };
            }
            throw error;
        }
    }

    async findAll(): Promise<Activity[]> {  

        try {
            
            const items = await this.prisma.activity.findMany({
                include: {
                    category: true,
                    unit: true,
                },
                orderBy: {
                    code: 'asc'
                }
            })
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
                  category: true,
                  unit: true,
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
