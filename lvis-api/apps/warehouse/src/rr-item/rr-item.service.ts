import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRrItemInput } from './dto/update-rr-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Prisma, RRApprover, RRItem } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, DB_TABLE, Role } from '../__common__/types';
import { UpdateRrItemsInput } from './dto/update-rr-items.input';
import { UpdateRrItemsResponse } from './entities/update-rr-items-response';
import { isAdmin, isNormalUser } from '../__common__/helpers';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';

@Injectable()
export class RrItemService {

	private includedFields = {
		rr: true
	}

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async findByRrId(rrId: string): Promise<RRItem[]> {

		return await this.prisma.rRItem.findMany({
			where: {
				rr_id: rrId
			},
			include: this.includedFields
		})

	}

	async findByRrNumber(rrNumber: string): Promise<RRItem[]> {

		return await this.prisma.rRItem.findMany({
			where: {
				rr: {
					rr_number: rrNumber
				}
			},
			include: this.includedFields
		})

	}

	async findOne(id: string): Promise<RRItem | null> {
		const item = await this.prisma.rRItem.findUnique({
			include: this.includedFields,
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('RR Item not found')
		}

		return item
	}

	async update(payload: { id: string, input: UpdateRrItemInput, authUser: AuthUser }): Promise<RRItem> {

		const { id, input, authUser } = payload

		const existingItem = await this.findOne(id)

		if (!this.canAccess({ rr_id: existingItem.rr_id, authUser })) {
			throw new ForbiddenException('Only Admin and Owner can remove canvass item!')
		}

		if (!(await this.canUpdate({ input, existingItem, authUser }))) {
			throw new Error('Failed to update RR Item. Please try again')
		}

		const data: Prisma.RRItemUpdateInput = {
			quantity_accepted: input.quantity_accepted ?? existingItem.quantity_accepted,
		};


		const updated = await this.prisma.rRItem.update({
			data,
			where: { id },
			include: this.includedFields
		})

		return updated

	}

	async updateMultiple(
		inputs: UpdateRrItemsInput[], 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<UpdateRrItemsResponse> {

        const authUser = metadata.authUser

		const firstInput = inputs[0]

		const rrItem = await this.prisma.rRItem.findUnique({
			where: { id: firstInput.id },
			select: {
				rr: {
					include: {
						rr_items: true,
					}
				}
			}
		})

		if (!rrItem) {
			throw new NotFoundException('rrItem not found with ID of ' + firstInput.id)
		}

		if (rrItem.rr.created_by !== authUser.user.username) {
			throw new ForbiddenException('Only Admin and Owner can update multiple rr items!')
		}

		return await this.prisma.$transaction(async(tx) => {

			for (let input of inputs) {
	
				await tx.rRItem.update({
					where: {
						id: input.id
					},
					data: {
						quantity_accepted: input.quantity_accepted,
					},
				})
	
			}

			const updated_rr = await tx.rR.findUnique({
				where: { id: rrItem.rr.id },
				include: {
					rr_items: true
				}
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.RR_ITEMS,
				action: 'UPDATE-RR-ITEMS',
				reference_id: rrItem.rr.rr_number,
				metadata: {
					'old_value': rrItem.rr,
					'new_value': updated_rr
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: 'RR Items updated!',
				// data: result
			}

		})


	}

	private async canUpdate(payload: { input: UpdateRrItemInput, existingItem: RRItem, authUser: AuthUser }): Promise<boolean> {

		const { input, existingItem, authUser } = payload

		const rr = await this.prisma.rR.findUnique({
			where: {
				id: existingItem.rr_id
			}
		})

		if (!rr) {
			throw new NotFoundException('RR not found with ID: ' + existingItem.rr_id)
		}

		// validates if there is already an approver who take an action
		if (isNormalUser(authUser)) {

			const approvers = await this.prisma.rRApprover.findMany({
				where: {
					rr_id: existingItem.rr_id
				}
			})

			// used to indicate whether there is at least one approver whose status is not pending.
			const isAnyNonPendingApprover = this.isAnyNonPendingApprover(approvers)

			if (isAnyNonPendingApprover) {
				throw new BadRequestException(`Unable to update RR Item. Can only update if all rr approver's status is pending`)
			}
		}

		return true

	}
	// used to indicate whether there is at least one approver whose status is not pending.
	private isAnyNonPendingApprover(approvers: RRApprover[]): boolean {

		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.PENDING) {

				return true

			}

		}

		return false

	}

	private async canAccess(payload: { rr_id: string, authUser: AuthUser }): Promise<boolean> {

		const { rr_id, authUser } = payload

		if (isAdmin(authUser)) return true

		const rr = await this.prisma.rR.findUnique({
			where: { id: rr_id }
		})

		if (!rr) {
			throw new NotFoundException('RR not found with id of ' + rr_id)
		}

		const isOwner = rr.created_by === authUser.user.username

		if (isOwner) return true

		return false

	}

}
