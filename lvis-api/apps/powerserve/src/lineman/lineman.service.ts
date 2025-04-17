import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Lineman } from './entities/lineman.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { CreateLinemanInput } from './dto/create-lineman.input';
import { MutationLinemanResponse } from './entities/mutation-lineman-response';
import { LinemanStatus, Prisma } from 'apps/powerserve/prisma/generated/client';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { UpdateLinemanInput } from './dto/update-lineman.input';

@Injectable()
export class LinemanService {

    private readonly logger = new Logger(LinemanService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateLinemanInput, 
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MutationLinemanResponse> {

        const authUser = metadata.authUser

        const existingLineman = await this.prisma.lineman.findUnique({
            where: { employee_id: input.employee_id },
        });
    
        if (existingLineman) {
            return { success: false, msg: 'Employee is already a lineman' }
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.lineman.create({
                data: {
                    employee_id: input.employee_id,
                    area: { connect: { id: input.area_id } },
                    supervisor_id: input.supervisor_id,
                    status: LinemanStatus.ACTIVE,
                },
                include: { area: true }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.LINEMAN,
                action: 'CREATE-LINEMAN',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Lineman successfully created!',
                data: created
            }

        })


    }

    async update(
        id: string,
        input: UpdateLinemanInput, 
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MutationLinemanResponse> {

        const authUser = metadata.authUser

        const existingLineman = await this.prisma.lineman.findUnique({
            where: { id },
            include: { area: true }
        });
    
        if (!existingLineman) {
            throw new NotFoundException('Lineman not found with id ' + id)
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const updated = await tx.lineman.update({
                where: { id },
                data: {
                    area: { connect: { id: input.area_id } },
                    supervisor_id: input.supervisor_id
                },
                include: { area: true }
            })

            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.LINEMAN,
                action: 'UPDATE-LINEMAN',
                reference_id: id,
                metadata: {
                    'old_value': existingLineman,
                    'new_value': updated
                },
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return {
                success: true,
                msg: 'Lineman successfully updated!',
                data: updated
            }

        })

    }

    async findAll(payload: { area_id?: string }): Promise<Lineman[]> {  

        const { area_id } = payload

        const items = await this.prisma.lineman.findMany({
            where: area_id ? { area_id } : undefined,
        });

        return items

    }

    async findOne(id: string): Promise<Lineman | null> {
        
        try {
            
            const item = await this.prisma.lineman.findUnique({
                where: { id },
                include: {
                    area: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Lineman not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() lineman', error)
        }

    }

    async get_all_lineman_by_current_user(payload: { authUser: AuthUser }): Promise<Lineman[]> {

        const { authUser } = payload

        if(!authUser.user.user_employee) {
            return []
        }

        const employee = authUser.user.user_employee.employee

        const area = await this.prisma.area.findUnique({ where: { oic_id: employee.id } })

        // is area head
        if(area) {

            return await this.prisma.lineman.findMany({
                where: {
                    OR: [
                        { area_id: area.id },
                        { supervisor_id: employee.id }
                    ]
                } 
            })

        }

        return []

    }

}
