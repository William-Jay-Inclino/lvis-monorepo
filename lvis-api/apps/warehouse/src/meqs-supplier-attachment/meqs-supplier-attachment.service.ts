import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeqsSupplierAttachmentInput } from './dto/create-meqs-supplier-attachment.input';
import { UpdateMeqsSupplierAttachmentInput } from './dto/update-meqs-supplier-attachment.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { MEQSSupplierAttachment, Prisma } from 'apps/warehouse/prisma/generated/client';
import { WarehouseRemoveResponse } from '../__common__/classes';
import axios from 'axios';
import { isAdmin } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class MeqsSupplierAttachmentService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async create(
        input: CreateMeqsSupplierAttachmentInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQSSupplierAttachment> {

        const authUser = metadata.authUser

        if (!this.canAccess({ meqs_supplier_id: input.meqs_supplier_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can create meqs supplier attachment!')
        }

        const data: Prisma.MEQSSupplierAttachmentCreateInput = {
            meqs_supplier: { connect: { id: input.meqs_supplier_id } },
            src: input.src,
            filename: input.filename,
        }

        return await this.prisma.$transaction(async(tx) => {
            
            const created = await tx.mEQSSupplierAttachment.create({
                data,
                include: {
                    meqs_supplier: true
                }
            })

            // create audit
            await this.audit.createAuditEntry({
                username: authUser.user.username,
                table: DB_TABLE.MEQS_SUPPLIER_ATTACHMENT,
                action: 'CREATE-MEQS-SUPPLIER-ATTACHMENT',
                reference_id: created.id,
                metadata: created,
                ip_address: metadata.ip_address,
                device_info: metadata.device_info
            }, tx as unknown as Prisma.TransactionClient)
    
            return created

        })



    }

    async findOne(id: string): Promise<MEQSSupplierAttachment | null> {

        const item = await this.prisma.mEQSSupplierAttachment.findUnique({
            include: {
                meqs_supplier: true
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('MEQS Supplier Attachment not found')
        }

        return item

    }

    async update(
        id: string, 
        input: UpdateMeqsSupplierAttachmentInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<MEQSSupplierAttachment> {

        const authUser = metadata.authUser

        const existingItem = await this.findOne(id)

        if (!this.canAccess({ meqs_supplier_id: existingItem.meqs_supplier_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can update meqs supplier!')
        }

        const data: Prisma.MEQSSupplierAttachmentUpdateInput = {
            src: input.src ?? existingItem.src,
            filename: input.filename ?? existingItem.filename,
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const updated = await tx.mEQSSupplierAttachment.update({
                data,
                where: { id },
                include: {
                    meqs_supplier: true
                }
            })

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MEQS_SUPPLIER_ATTACHMENT,
				action: 'UPDATE-MEQS-SUPPLIER-ATTACHMENT',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)

    
            return updated

        })


    }

    async remove(
        id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<WarehouseRemoveResponse> {

        const authUser = metadata.authUser

        const existingItem = await this.findOne(id)

        if (!this.canAccess({ meqs_supplier_id: existingItem.meqs_supplier_id, authUser })) {
            throw new ForbiddenException('Only Admin and Owner can remove meqs supplier!')
        }

        return await this.prisma.$transaction(async(tx) => {

            const deleted = await tx.mEQSSupplierAttachment.delete({
                where: { id },
            })

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.MEQS_SUPPLIER_ATTACHMENT,
				action: 'DELETE-MEQS-SUPPLIER-ATTACHMENT',
				reference_id: id,
				metadata: {
					'deleted_value': deleted
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)

    
            this.deleteFiles([existingItem.src])
    
            return {
                success: true,
                msg: "MEQS Supplier Attachment successfully deleted"
            }

        })


    }

    private async deleteFiles(filePaths: string[]) {

        try {

            const url = process.env.API_URL + '/api/v1/file-upload/warehouse/meqs'
            return axios.delete(url, { data: filePaths });

        } catch (error) {
            throw new Error(`Error deleting files: ${ error }`)
        }

    }

    private async canAccess(payload: { meqs_supplier_id: string, authUser: AuthUser }): Promise<boolean> {

        const { meqs_supplier_id, authUser } = payload

        if (isAdmin(authUser)) return true

        const meqsSupplier = await this.prisma.mEQSSupplier.findUnique({
            where: {
                id: meqs_supplier_id
            },
            include: {
                meqs: true
            }
        })

        if (!meqsSupplier) {
            throw new NotFoundException('meqsSupplier not found with id of ' + meqs_supplier_id)
        }

        const isOwner = meqsSupplier.meqs.created_by === authUser.user.username

        if (isOwner) return true

        return false

    }

}
