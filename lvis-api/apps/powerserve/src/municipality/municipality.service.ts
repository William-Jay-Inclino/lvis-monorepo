import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Municipality, Prisma } from 'apps/powerserve/prisma/generated/client';
import { CreateMunicipalityInput } from './dto/create-municipality.input';
import { MutationMunicipalityResponse } from './entities/mutation-municipality-response';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { UpdateMunicipalityInput } from './dto/update-municipality.input';

@Injectable()
export class MunicipalityService {

    private readonly logger = new Logger(MunicipalityService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateMunicipalityInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationMunicipalityResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        const existingMunicipality = await this.prisma.municipality.findUnique({ 
            where: {
                area_id_name: {
                    name: input.name, area_id: input.area_id
                }
            } 
        })

        if (existingMunicipality) return { success: false, msg: 'Municipality already exists' };
    
        return this.prisma.$transaction(async (tx) => {
            const created = await tx.municipality.create({
                data: {
                    area: { connect: { id: input.area_id } },
                    name: input.name
                }
            });
    
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MUNICIPALITY,
                action: 'CREATE-MUNICIPALITY',
                reference_id: created.id,
                metadata: created, 
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Municipality created successfully',
                data: created
            };
        });
    }

    async update(
        id: string,
        input: UpdateMunicipalityInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationMunicipalityResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify municipality exists
            const existing = await tx.municipality.findUnique({ 
                where: { id },
                include: { area: true }
            });
            if (!existing) {
                return { success: false, msg: 'Municipality not found' };
            }
    
            // 2. Check for unique constraint violation only if relevant fields change
            if (input.area_id !== existing.area_id || input.name !== existing.name) {
                const conflict = await tx.municipality.findFirst({
                    where: {
                        area_id: input.area_id,
                        name: input.name,
                        NOT: { id }
                    },
                    select: { id: true }
                });
                if (conflict) {
                    return { 
                        success: false, 
                        msg: 'Municipality with this name already exists in the specified area' 
                    };
                }
            }
    
            // 3. Perform update
            const updated = await tx.municipality.update({
                where: { id },
                data: {
                    area_id: input.area_id,
                    name: input.name
                },
                include: { area: true }
            });
    
            // 4. Audit log
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MUNICIPALITY,
                action: 'UPDATE-MUNICIPALITY',
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
                msg: 'Municipality updated successfully',
                data: updated
            };
        });
    }

    async findAll(): Promise<Municipality[]> {  

        try {
            
            const items = await this.prisma.municipality.findMany({
                include: {
                    barangays: {
                        include: {
                            sitios: true
                        }
                    },
                    area: true,
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() municipality', error)            
        }

    }

    async findOne(id: string): Promise<Municipality | null> {
        
        try {
            
            const item = await this.prisma.municipality.findUnique({
                where: { id },
                include: {
                    area: true,
                    barangays: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Municipality not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() municipality', error)
        }

    }

    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
        ): Promise<MutationMunicipalityResponse> {
        const authUser = metadata.authUser;
        
        const existingItem = await this.prisma.municipality.findUnique({
            where: { id }
        });
        
        if (!existingItem) {
            throw new NotFoundException('Municipality not found with id ' + id);
        }
        
        const isReferenced = await this.prisma.barangay.findFirst({
            where: { municipality_id: id },
            select: { id: true }
        });
        
        if (isReferenced) {
            return {
                success: false,
                msg: 'Unable to delete municipality. It is referenced in a barangay.'
            };
        }
        
        return this.prisma.$transaction(async (tx) => {
            const deleted = await tx.municipality.delete({
                where: { id }
            });
        
            await this.audit.createAuditEntry(
                {
                    username: authUser.user.username,
                    table: DB_TABLE.MUNICIPALITY,
                    action: 'DELETE-MUNICIPALITY',
                    reference_id: id,
                    metadata: deleted,
                    ip_address: metadata.ip_address,
                    device_info: metadata.device_info
                },
                tx as unknown as Prisma.TransactionClient
            );
        
            return {
                success: true,
                msg: 'Municipality successfully deleted'
            };
        });
    }

}
