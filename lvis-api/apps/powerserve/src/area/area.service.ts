import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Area, Prisma } from 'apps/powerserve/prisma/generated/client';
import { CreateAreaInput } from './dto/create-area.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MutationAreaResponse } from './entities/mutation-area-response';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { UpdateAreaInput } from './dto/update-area.input';

@Injectable()
export class AreaService {

    private readonly logger = new Logger(AreaService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateAreaInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationAreaResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        // Check for existing assignments in parallel
        const [existingOic, existingArea] = await Promise.all([
            this.prisma.area.findUnique({ where: { oic_id: input.oic_id } }),
            this.prisma.area.findUnique({ where: { name: input.name } })
        ]);
    
        if (existingOic) return { success: false, msg: 'Area Head already has assigned area' };
        if (existingArea) return { success: false, msg: 'Area already exists' };
    
        return this.prisma.$transaction(async (tx) => {
            const created = await tx.area.create({
                data: {
                    oic_id: input.oic_id,
                    name: input.name
                }
            });
    
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.AREA,
                action: 'CREATE-AREA',
                reference_id: created.id,
                metadata: created, 
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Area created successfully',
                data: created
            };
        });
    }
    
    async update(
        id: string,
        input: UpdateAreaInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationAreaResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        return this.prisma.$transaction(async (tx) => {
            const existingArea = await tx.area.findUnique({ where: { id } });
            if (!existingArea) {
                return { success: false, msg: 'Area not found' };
            }
    
            if (input.oic_id !== existingArea.oic_id) {
                const oicInUse = await tx.area.findFirst({ 
                    where: { 
                        oic_id: input.oic_id,
                        id: { not: id } 
                    }
                });
                if (oicInUse) {
                    return { success: false, msg: 'New Area Head already has an assigned area' };
                }
            }
    
            if (input.name !== existingArea.name) {
                const nameExists = await tx.area.findFirst({
                    where: {
                        name: input.name,
                        id: { not: id } 
                    }
                });
                if (nameExists) {
                    return { success: false, msg: 'Area name already exists' };
                }
            }
    
            const updatedArea = await tx.area.update({
                where: { id },
                data: {
                    oic_id: input.oic_id,
                    name: input.name
                }
            });
    
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.AREA,
                action: 'UPDATE-AREA',
                reference_id: id,
                metadata: {
                    'old_value': existingArea,
                    'new_value': updatedArea
                },
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Area updated successfully',
                data: updatedArea
            };
        });
    }

    async findAll(): Promise<Area[]> {  

        try {
            
            const items = await this.prisma.area.findMany({
                include: {
                    municipalities: {
                        include: {
                            barangays: {
                                include: {
                                    sitios: true
                                }
                            }
                        }
                    },
                    linemen: true
                },
                orderBy: {
                    name: 'asc'
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() area', error)            
        }

    }

    async findOne(id: string): Promise<Area | null> {
        
        try {
            
            const item = await this.prisma.area.findUnique({
                where: { id },
                include: {
                    linemen: true,
                    municipalities: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Area not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() area', error)
        }

    }

    async get_total_municipalities(payload: { area_id: string }): Promise<number> {

        const { area_id } = payload

        return await this.prisma.municipality.count({ where: { area_id } })

    }

    async get_total_barangays(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.barangay.count({
          where: {
            municipality: {
              area_id: area_id,
            },
          },
        });
    }

    async get_total_sitios(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.sitio.count({
          where: {
            barangay: {
              municipality: {
                area_id: area_id,
              },
            },
          },
        });
    }

    async get_total_lineman(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.lineman.count({
          where: {
            area_id
          },
        });
    }
    
    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
      ): Promise<MutationAreaResponse> {
        const { authUser, ip_address, device_info } = metadata;
      
        try {
          return await this.prisma.$transaction(async (tx) => {
            // Check if lineman exists
            const existingItem = await tx.area.findUnique({
                where: { id },
                select: { id: true }
            });
      
            if (!existingItem) {
                return { success: false, msg: "Area not found" };
            }
      
            const relationChecks = await Promise.all([
                tx.lineman.findFirst({ where: { area_id: id }, select: { id: true } }),
                tx.municipality.findFirst({ where: { area_id: id }, select: { id: true } }),
                tx.taskAssignment.findFirst({ where: { area_id: id }, select: { id: true } }),
            ]);
      
            const hasRelations = relationChecks.some((relation) => relation !== null);
      
            if (hasRelations) {
                return {
                    success: false,
                    msg: "Unable to delete: Area has existing records"
                };
            }
      
            // Proceed with deletion
            const deletedItem = await tx.area.delete({
                where: { id },
            });
      
            // Audit log
            await this.audit.createAuditEntry(
              {
                username: authUser.user.username,
                table: DB_TABLE.AREA,
                action: "DELETE-AREA",
                reference_id: id,
                metadata: deletedItem,
                ip_address,
                device_info
              },
              tx as unknown as Prisma.TransactionClient
            );
      
            return { success: true, msg: "Area successfully deleted" };
          });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { success: false, msg: "Database error during deletion" };
            }
            throw error;
        }
    }

}
