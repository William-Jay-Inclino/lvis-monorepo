import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeqsSupplierInput } from './dto/create-meqs-supplier.input';
import { UpdateMeqsSupplierInput } from './dto/update-meqs-supplier.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MEQSSupplier, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { MeqsSupplierAttachment } from '../meqs-supplier-attachment/entities/meqs-supplier-attachment.entity';
import axios from 'axios';
import { isAdmin } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class MeqsSupplierService {

    constructor(
        private readonly prisma: PrismaService,
                private readonly audit: WarehouseAuditService,
    ) { }

    async create(
        input: CreateMeqsSupplierInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQSSupplier> {

        const authUser = metadata.authUser

        if (!this.canAccess({ meqs_id: input.meqs_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can create meqs supplier!')
        }

        if (!this.canCreate(input)) {
            throw new BadRequestException()
        }

        const data: Prisma.MEQSSupplierCreateInput = {
            meqs: { connect: { id: input.meqs_id } },
            supplier: { connect: { id: input.supplier_id } },
            payment_terms: input.payment_terms,
            meqs_supplier_items: {
                create: input.meqs_supplier_items.map(item => {

                    const itemInput: Prisma.MEQSSupplierItemCreateWithoutMeqs_supplierInput = {
                        price: item.price,
                        notes: item.notes,
                        vat_type: item.vat_type,
                        is_awarded: item.is_awarded,
                        canvass_item: { connect: { id: item.canvass_item_id } },
                    }

                    return itemInput
                })
            }
        }

        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.mEQSSupplier.create({
                data,
                include: {
                    supplier: true,
                    attachments: true,
                    meqs_supplier_items: {
                        include: {
                            canvass_item: {
                                include: {
                                    unit: true,
                                    item: true
                                }
                            }
                        }
                    }
                }
            })
            
            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MEQS_SUPPLIER,
                action: 'CREATE-MEQS-SUPPLIER',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
            

            return created

        })


    }

    async findOne(id: string): Promise<MEQSSupplier | null> {

        const item = await this.prisma.mEQSSupplier.findUnique({
            include: {
                meqs: true,
                supplier: true,
                meqs_supplier_items: true,
                attachments: true
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('MEQS Supplier not found')
        }

        return item

    }

    async update(
        id: string, 
        input: UpdateMeqsSupplierInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQSSupplier> {

        const authUser = metadata.authUser

        const existingItem = await this.prisma.mEQSSupplier.findUnique({
            where: { id },
            include: {
                supplier: true,
                attachments: true,
                meqs_supplier_items: {
                    include: {
                        canvass_item: {
                            include: {
                                unit: true,
                                item: true
                            }
                        }
                    }
                }
            }
        })

        if (!this.canAccess({ meqs_id: existingItem.meqs_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update meqs supplier!')
        }

        const data: Prisma.MEQSSupplierUpdateInput = {
            payment_terms: input.payment_terms ?? existingItem.payment_terms,
        }

        return await this.prisma.$transaction(async(tx) => {

            if (input.meqs_supplier_items) {
    
                for (let item of input.meqs_supplier_items) {
    
                    await tx.mEQSSupplierItem.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            price: item.price,
                            vat_type: item.vat_type
                        }
                    })
    
                }
    
            }
    
            const meqs_supplier_updated = await tx.mEQSSupplier.update({
                data,
                where: { id },
                include: {
                    supplier: true,
                    attachments: true,
                    meqs_supplier_items: {
                        include: {
                            canvass_item: {
                                include: {
                                    unit: true,
                                    item: true
                                }
                            }
                        }
                    }
                }
            })

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MEQS_SUPPLIER,
				action: 'UPDATE-MEQS-SUPPLIER',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': meqs_supplier_updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)


            return meqs_supplier_updated
    
        })


    }

    async remove(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseRemoveResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.findOne(id)

        if (!this.canAccess({ meqs_id: existingItem.meqs_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can remove meqs supplier!')
        }

        // @ts-ignore
        if(existingItem.attachments && existingItem.attachments.length > 0) {
            // @ts-ignore
            const filePaths = existingItem.attachments.map((i: MeqsSupplierAttachment) => i.src)
    
            // delete files in server
            this.deleteFiles(filePaths)
        }

        return await this.prisma.$transaction(async(tx) => {

            const deleted = await tx.mEQSSupplier.delete({
                where: { id },
            })

            // create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MEQS_SUPPLIER,
				action: 'DELETE-MEQS-SUPPLIER',
				reference_id: id,
				metadata: {
					'deleted_value': deleted,
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)
    

            return {
                success: true,
                msg: "MEQS Supplier successfully deleted"
            }

        })


    }

    async canCreate(input: CreateMeqsSupplierInput): Promise<boolean> {

        const existingMeqsSupplier = await this.prisma.mEQSSupplier.findFirst({
            where: {
                meqs_id: input.meqs_id,
                supplier_id: input.supplier_id
            }
        })

        if (existingMeqsSupplier) {
            throw new BadRequestException(`Meqs ID: ${input.meqs_id} with Supplier ID: ${input.supplier_id} already referenced`)
        }

        return true

    }

    async isReferenced(meqs_supplier_id: string): Promise<Boolean> {

        const meqs = await this.prisma.pO.findUnique({
            where: { meqs_supplier_id }
        })

        if (meqs) return true

        return false

    }

    private async deleteFiles(filePaths: string[]) {

        const url = process.env.API_URL + '/api/v1/file-upload/warehouse/meqs'

        return axios.delete(url, { data: filePaths });
    }

    private async canAccess(payload: { meqs_id: string, authUser: AuthUser }): Promise<boolean> {

        const { meqs_id, authUser } = payload

        if (isAdmin(authUser)) return true

        const meqs = await this.prisma.mEQS.findUnique({
            where: { id: meqs_id }
        })

        if (!meqs) {
            throw new NotFoundException('MEQS not found with id of ' + meqs_id)
        }

        const isOwner = meqs.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

}
