import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateSitioInput } from './dto/create-sitio.input';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from '@prisma/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Sitio } from 'apps/powerserve/prisma/generated/client';
import { UpdateSitioInput } from './dto/update-sitio.input';
import { MutationSitioResponse } from './entities/mutation-sitio-response';

@Injectable()
export class SitioService {

    private readonly logger = new Logger(SitioService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateSitioInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationSitioResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        const existingSitio = await this.prisma.sitio.findUnique({ 
            where: {
                barangay_id_name: {
                    name: input.name, barangay_id: input.barangay_id
                }
            },
            include: {
                barangay: {
                    include: {
                        municipality: true
                    }
                }
            }
        })

        if (existingSitio) return { success: false, msg: 'Sitio already exists' };
    
        return this.prisma.$transaction(async (tx) => {
            const created = await tx.sitio.create({
                data: {
                    barangay: { connect: { id: input.barangay_id } },
                    name: input.name,
                },
                include: {
                    barangay: {
                        include: {
                            municipality: true
                        }
                    }
                }
            });
    
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.SITIO,
                action: 'CREATE-SITIO',
                reference_id: created.id,
                metadata: created, 
                ip_address,
                device_info
            }, tx as unknown as Prisma.TransactionClient);
    
            return {
                success: true,
                msg: 'Sitio created successfully',
                data: created
            };
        });
    }

    async update(
        id: string,
        input: UpdateSitioInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationSitioResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify barangay exists
            const existing = await tx.sitio.findUnique({ 
                where: { id },
                select: { id: true, name: true, barangay_id: true },
                include: { barangay: true }
            });
            if (!existing) {
                return { success: false, msg: 'Sitio not found' };
            }
    
            // 2. Check for unique constraint violation only if relevant fields change
            if (input.barangay_id !== existing.barangay_id || input.name !== existing.name) {
                const conflict = await tx.sitio.findFirst({
                    where: {
                        barangay_id: input.barangay_id,
                        name: input.name,
                        NOT: { id }
                    },
                    select: { id: true }
                });
                if (conflict) {
                    return { 
                        success: false, 
                        msg: 'Sitio with this name already exists in the specified Barangay' 
                    };
                }
            }
    
            // 3. Perform update
            const updated = await tx.sitio.update({
                where: { id },
                data: {
                    barangay: { connect: { id: input.barangay_id } },
                    name: input.name
                },
                include: { barangay: true }
            });
    
            // 4. Audit log
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.SITIO,
                action: 'UPDATE-SITIO',
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
                msg: 'Sitio updated successfully',
                data: updated
            };
        });
    }

    async findAll(): Promise<Sitio[]> {  

        try {
            
            const items = await this.prisma.sitio.findMany({
                include: {
                    barangay: true,
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() sitio', error)            
        }

    }

    async findOne(id: string): Promise<Sitio | null> {
        
        try {
            
            const item = await this.prisma.sitio.findUnique({
                where: { id },
                include: {
                    barangay: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Sitio not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() sitio', error)
        }

    }

    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
      ): Promise<MutationSitioResponse> {
        const authUser = metadata.authUser;
      
        const existingItem = await this.prisma.sitio.findUnique({
          where: { id }
        });
      
        if (!existingItem) {
          throw new NotFoundException('Sitio not found with id ' + id);
        }
      
        // More efficient check — just check existence, not load all details
        const isReferenced = await this.prisma.complaintDetail.findFirst({
          where: { sitio_id: id },
          select: { id: true }
        });
      
        if (isReferenced) {
          return {
            success: false,
            msg: 'Unable to delete sitio. It is referenced in a complaint.'
          };
        }
      
        return this.prisma.$transaction(async (tx) => {
          const deleted = await tx.sitio.delete({
            where: { id }
          });
      
          await this.audit.createAuditEntry(
            {
              username: authUser.user.username,
              table: DB_TABLE.SITIO,
              action: 'DELETE-SITIO',
              reference_id: id,
              metadata: deleted,
              ip_address: metadata.ip_address,
              device_info: metadata.device_info
            },
            tx as unknown as Prisma.TransactionClient
          );
      
          return {
            success: true,
            msg: 'Sitio successfully deleted'
          };
        });
    }
      

}
