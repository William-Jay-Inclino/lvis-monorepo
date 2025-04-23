import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Barangay, Prisma } from 'apps/powerserve/prisma/generated/client';
import { CreateBarangayInput } from './dto/create-barangay.input';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MutationBarangayResponse } from './entities/mutation-barangay-response';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { UpdateBarangayInput } from './dto/update-barangay.input';

@Injectable()
export class BarangayService {

    private readonly logger = new Logger(BarangayService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateBarangayInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationBarangayResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        const existingBarangay = await this.prisma.barangay.findUnique({ 
            where: {
                municipality_id_name: {
                    name: input.name, municipality_id: input.municipality_id
                }
            } 
        })

        if (existingBarangay) return { success: false, msg: 'Barangay already exists' };
    
        return this.prisma.$transaction(async (tx) => {
            const created = await tx.barangay.create({
                data: {
                    municipality: { connect: { id: input.municipality_id } },
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
                msg: 'Barangay created successfully',
                data: created
            };
        });
    }

    async update(
        id: string,
        input: UpdateBarangayInput,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
    ): Promise<MutationBarangayResponse> {
        const { authUser, ip_address, device_info } = metadata;
    
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify barangay exists
            const existing = await tx.barangay.findUnique({ 
                where: { id },
                include: { municipality: true }
            });
            if (!existing) {
                return { success: false, msg: 'Barangay not found' };
            }
    
            // 2. Check for unique constraint violation only if relevant fields change
            if (input.municipality_id !== existing.municipality_id || input.name !== existing.name) {
                const conflict = await tx.barangay.findFirst({
                    where: {
                        municipality_id: input.municipality_id,
                        name: input.name,
                        NOT: { id }
                    },
                    select: { id: true }
                });
                if (conflict) {
                    return { 
                        success: false, 
                        msg: 'Barangay with this name already exists in the specified Municipality' 
                    };
                }
            }
    
            // 3. Perform update
            const updated = await tx.barangay.update({
                where: { id },
                data: {
                    municipality: { connect: { id: input.municipality_id } },
                    name: input.name
                },
                include: { municipality: true }
            });
    
            // 4. Audit log
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.BARANGAY,
                action: 'UPDATE-BARANGAY',
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
                msg: 'Barangay updated successfully',
                data: updated
            };
        });
    }

    async findAll(): Promise<Barangay[]> {  

        try {
            
            const items = await this.prisma.barangay.findMany({
                include: {
                    sitios: true,
                    municipality: true,
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() barangay', error)            
        }

    }

    async findOne(id: string): Promise<Barangay | null> {
        
        try {
            
            const item = await this.prisma.barangay.findUnique({
                where: { id },
                include: {
                    municipality: true,
                    sitios: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Barangay not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() barangay', error)
        }

    }

    async remove(
        id: string,
        metadata: { ip_address: string; device_info: any; authUser: AuthUser }
      ): Promise<MutationBarangayResponse> {
        const { authUser, ip_address, device_info } = metadata;
      
        try {
          return await this.prisma.$transaction(async (tx) => {
            // Check if lineman exists
            const existingItem = await tx.barangay.findUnique({
                where: { id },
                select: { id: true }
            });
      
            if (!existingItem) {
                return { success: false, msg: "Barangay not found" };
            }
      
            const relationChecks = await Promise.all([
                tx.sitio.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.complaintDetail.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.taskDetailPowerInterruption.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.taskDetailKwhMeter.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.taskDetailLineServices.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.taskDetailDles.findFirst({ where: { barangay_id: id }, select: { id: true } }),
                tx.taskDetailLmdga.findFirst({ where: { barangay_id: id }, select: { id: true } }),
            ]);
      
            const hasRelations = relationChecks.some((relation) => relation !== null);
      
            if (hasRelations) {
                return {
                    success: false,
                    msg: "Unable to delete: Barangay has existing records"
                };
            }
      
            // Proceed with deletion
            const deletedItem = await tx.barangay.delete({
                where: { id },
            });
      
            // Audit log
            await this.audit.createAuditEntry(
              {
                username: authUser.user.username,
                table: DB_TABLE.BARANGAY,
                action: "DELETE-BARANGAY",
                reference_id: id,
                metadata: deletedItem,
                ip_address,
                device_info
              },
              tx as unknown as Prisma.TransactionClient
            );
      
            return { success: true, msg: "Barangay successfully deleted" };
          });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { success: false, msg: "Database error during deletion" };
            }
            throw error;
        }
    }

}
