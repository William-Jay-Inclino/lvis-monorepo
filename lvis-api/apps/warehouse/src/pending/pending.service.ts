import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MRVItem, MSTItem, OSRIVItem, Pending, Prisma, SERIVItem, MCRTItem as _MCRTItem } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';
import { APPROVAL_STATUS, ITEM_TRANSACTION_TYPE } from '../__common__/types';
import { DB_ENTITY, ITEM_TYPE_CODE, ModuleMapping, WAREHOUSE_REQUEST_TYPE } from '../__common__/constants';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { getModule } from '../__common__/helpers';
import { ITEM_STATUS } from '../item/entities/item.types';
import { ItemService } from '../item/item.service';
import { TRIP_TICKET_STATUS } from '../trip-ticket/entities/trip-ticket.enums';
import { CommonService } from '../__common__/classes';
import { PendingResponse } from './entities/pending-response.entity';

@Injectable()
export class PendingService {

    private readonly logger = new Logger(PendingService.name);
    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly itemService: ItemService,
        private readonly commonService: CommonService,
    ) {}

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async update_approver_notes(pending_id: number, notes: string): Promise<PendingResponse> {

        try {

            await this.prisma.pending.update({
                where: {
                    id: pending_id
                },
                data: {
                    approver_notes: notes
                }
            })

            return {
                success: true,
                msg: 'Notes added successfully'
            }
            
        } catch (error) {
            throw new Error(`Error in updating pending. pending_id: ${pending_id}, notes: ${notes}`)
        }

    }

    async approveOrDisapprovePending(payload: {
        id: number, 
        status: APPROVAL_STATUS,
        remarks: string,
        classification_id?: string,
        fund_source_id?: string
    }) {

        const {
            id,
            status,
            remarks,
            classification_id,
            fund_source_id,
        } = payload

        // =================== UPDATE APPROVER STATUS, REMARKS/NOTES, & DATE APPROVAL =================== 

        return await this.prisma.$transaction( async(tx) => {

            let is_last_approver = false
            const pending = await this.get_pending(tx as Prisma.TransactionClient, id)
            const module = getModule(pending.reference_table as DB_ENTITY)
            const model = await this.get_model(tx as Prisma.TransactionClient, module, pending)
            const approverModel = await this.get_approver_model(tx as Prisma.TransactionClient, module, model.id, pending.approver_id)

            // update approver status and notes
            await tx[module.approverModel].update({
                where: {
                    id: approverModel.id  
                },
                data: {
                    status,
                    notes: (!!remarks && remarks.trim().length > 0) ? remarks : approverModel.notes,
                    date_approval: new Date(),
                },
            })

            // delete pending
            await tx.pending.delete({
                where: {
                    id: pending.id
                }
            })

            if(status === APPROVAL_STATUS.APPROVED) {

                // get the next in line approver
                const newPending = await tx[module.approverModel].findFirst({
                    select: {
                        approver_id: true,
                    },
                    where: {
                        [module.id]: model.id,
                        status: APPROVAL_STATUS.PENDING,
                        NOT: {
                            AND: [
                                { approver_id: pending.approver_id },
                                { order: approverModel.order },
                            ]
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                })

                // add new pending if there is next in line approver. Otherwise approver is last
                if(newPending) {

                    await tx.pending.create({
                        data: {
                            approver_id: newPending.approver_id,
                            reference_number: pending.reference_number,
                            reference_table: pending.reference_table,
                            description: pending.description,
                        }
                    })

                } else {

                    is_last_approver = true
                }

            } 
            else if(status === APPROVAL_STATUS.DISAPPROVED) {

                if(module.model === 'tripTicket') {
                    await tx.tripTicket.update({
                        where: {
                            id: model.id
                        },
                        data: {
                            status: TRIP_TICKET_STATUS.DISAPPROVED
                        }
                    })
                } 
                
                else {

                    await tx[module.model].update({
                        where: {
                            id: model.id
                        },
                        data: {
                            approval_status: APPROVAL_STATUS.DISAPPROVED
                        }
                    })

                }

                const entities_with_queuing = [DB_ENTITY.OSRIV, DB_ENTITY.SERIV, DB_ENTITY.MRV, DB_ENTITY.MCT]

                if(entities_with_queuing.includes(pending.reference_table as DB_ENTITY)) {
                    await this.remove_queue_of_items(tx as Prisma.TransactionClient, pending)
                }

            }

            // if classification is define then update it
            const canUpdateClassification = !!classification_id && (module.model === 'rV' || module.model === 'sPR' || module.model === 'jO')
            if( canUpdateClassification && (await this.isClassificationExist(classification_id, this.authUser)) ) {
                
                await tx[module.model].update({
                    data: {
                        classification_id,
                    },
                    where: {
                        id: model.id
                    }
                })

            }

            // if fund source id is define then update it
            const canUpdateFundSource = !!fund_source_id && module.model === 'pO'

            if( canUpdateFundSource && (await this.isFundSourceExist(fund_source_id, this.authUser)) ){

                await tx.pO.update({
                    data: {
                        fund_source_id,
                    },
                    where: {
                        id: model.id
                    }
                })

            }

            if(status === APPROVAL_STATUS.APPROVED && is_last_approver === true) {

                if(module.model === 'rV') await this.handle_RV_completion_of_approvals(tx as Prisma.TransactionClient, model.id) 

                else if(module.model === 'sPR') await this.handle_SPR_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'jO')  await this.handle_JO_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'mEQS') await this.handle_MEQS_completion_of_approvals(tx as Prisma.TransactionClient, model.id) 

                else if(module.model === 'pO') await this.handle_PO_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'rR') await this.handle_RR_completion_of_approvals(tx as Prisma.TransactionClient, model.id) 

                else if(module.model === 'oSRIV') await this.handle_OSRIV_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'sERIV') await this.handle_SERIV_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'mRV') await this.handle_MRV_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'mCT') await this.handle_MCT_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'mCRT') await this.handle_MCRT_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'mST') await this.handle_MST_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

                else if(module.model === 'gasSlip') await this.handle_gas_slip_completion_of_approvals(tx as Prisma.TransactionClient, model.id)
                    
                else if(module.model === 'tripTicket') await this.handle_trip_ticket_completion_of_approvals(tx as Prisma.TransactionClient, model.id)

            }

            return {
                success: true,
                msg: 'Successfully updated pending'
            }

        })


    }

    private async get_pending(tx: Prisma.TransactionClient, pending_id: number): Promise<Pending> {
        const pending = await tx.pending.findUnique({
            where: { id: pending_id }
        })

        if(!pending) {
            throw new NotFoundException('pending id not found')
        }
        
        return pending
    }
    
    // model can be: rv/spr/jo/meqs/po/rr/ and etc. pls see MODULE_MAPPER constant
    private async get_model(tx: Prisma.TransactionClient, module: ModuleMapping, pending: Pending) {
        const model = await tx[module.model].findUnique({
            select: {
                id: true,
            },
            where: {
                [module.rcNumber]: pending.reference_number,
            }
        })

        if(!model) {
            throw new NotFoundException(`reference_number: ${pending.reference_number} not found in ${pending.reference_table}`)
        }

        return model
    }

    // can be rvApprover, joApprover, and etc
    private async get_approver_model(tx: Prisma.TransactionClient, module: ModuleMapping, model_id: string, approver_id: string) {
        const approverModel = await tx[module.approverModel].findFirst({
            where: {
                approver_id: approver_id,
                [module.id]: model_id,
                status: APPROVAL_STATUS.PENDING
            },
            orderBy: {
                order: 'asc'  
            }
        });

        if(!approverModel) {
            throw new NotFoundException(`record to update not found`)
        }

        return approverModel
    }

    private async isClassificationExist(classification_id: string, authUser: AuthUser): Promise<boolean> {

        const query = `
            query{
                classification(id: "${classification_id}") {
                    id
                }
            }
        `;

        const { data } = await firstValueFrom(
            this.httpService.post(process.env.API_GATEWAY_URL,
                { query },
                {
                    headers: {
                        Authorization: authUser.authorization,
                        'Content-Type': 'application/json'
                    }
                }
            ).pipe(
                catchError((error) => {
                    throw error
                }),
            ),
        );

        if (!data || !data.data || !data.data.classification) {
            return false
        }
        const classification = data.data.classification
        return true

    }

    private async isFundSourceExist(fund_source_id: string, authUser: AuthUser): Promise<boolean> {

        const query = `
            query{
                account(id: "${fund_source_id}") {
                    id
                }
            }
        `;

        const { data } = await firstValueFrom(
            this.httpService.post(process.env.API_GATEWAY_URL,
                { query },
                {
                    headers: {
                        Authorization: authUser.authorization,
                        'Content-Type': 'application/json'
                    }
                }
            ).pipe(
                catchError((error) => {
                    throw error
                }),
            ),
        );

        if (!data || !data.data || !data.data.account) {
            return false
        }
        const account = data.data.account
        return true

    }

    private async handle_RV_completion_of_approvals(tx: Prisma.TransactionClient, rv_id: string) {

        const rv = await tx.rV.findUnique({
            where: { id: rv_id },
            include: {
                rv_approvers: true
            }
        })

        if(!rv) {
            throw new NotFoundException('RV not found with id: ' + rv_id)
        }

        await tx.rV.update({
            where: { id: rv_id },
            data: { 
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_SPR_completion_of_approvals(tx: Prisma.TransactionClient, spr_id: string) {

        const spr = await tx.sPR.findUnique({
            where: { id: spr_id },
            include: {
                spr_approvers: true
            }
        })

        if(!spr) {
            throw new NotFoundException('SPR not found with id: ' + spr_id)
        }

        await tx.sPR.update({
            where: { id: spr_id },
            data: { 
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_JO_completion_of_approvals(tx: Prisma.TransactionClient, jo_id: string) {

        const jo = await tx.jO.findUnique({
            where: { id: jo_id },
            include: {
                jo_approvers: true
            }
        })

        if(!jo) {
            throw new NotFoundException('JO not found with id: ' + jo_id)
        }

        await tx.jO.update({
            where: { id: jo_id },
            data: { 
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_MEQS_completion_of_approvals(tx: Prisma.TransactionClient, meqs_id: string) {

        const meqs = await tx.mEQS.findUnique({
            where: { id: meqs_id },
            include: {
                meqs_approvers: true
            }
        })

        if(!meqs) {
            throw new NotFoundException('MEQS not found with id: ' + meqs_id)
        }

        await tx.mEQS.update({
            where: { id: meqs_id },
            data: { 
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_PO_completion_of_approvals(tx: Prisma.TransactionClient, po_id: string) {

        const po = await tx.pO.findUnique({
            where: { id: po_id },
            include: {
                po_approvers: true
            }
        })

        if(!po) {
            throw new NotFoundException('PO not found with id: ' + po_id)
        }

        await tx.pO.update({
            where: { id: po_id },
            data: { 
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_RR_completion_of_approvals(tx: Prisma.TransactionClient, rr_id: string): Promise<void> {

        const rr = await tx.rR.findUnique({
            include: {
                rr_items: {
                    include: {
                        meqs_supplier_item: {
                            include: {
                                canvass_item: {
                                    include: {
                                        item: true
                                    }
                                }
                            }
                        }
                    }
                },
                rr_approvers: true,
            },
            where: { id: rr_id }
        })

        if(!rr) {
            throw new NotFoundException('RR not found with id: ' + rr_id)
        }

        if(rr.is_completed) {
			return
        }

        const hasDisapproval = rr.rr_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

        const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

        for(let rrItem of rr.rr_items) {

            if (!rrItem.meqs_supplier_item.canvass_item.item) {
				continue
			}

            const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: rrItem.meqs_supplier_item.canvass_item.item.id,
				rr_item_id: rrItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: rrItem.quantity_accepted,
				price: rrItem.meqs_supplier_item.price,
				remarks: 'From RR'
			}

			itemTransactions.push(data)
        }

        // item transaction history
        await tx.itemTransaction.createMany({
            data: itemTransactions
        })

        // update each item total quantity
        for(let item_trans of itemTransactions) {

            const item = await tx.item.findUnique({ where: { id: item_trans.item_id } });
			if (!item) {
				throw new NotFoundException(`Item not found with item_id: ${item_trans.item_id}`);
			}

			await tx.item.update({
				where: { id: item.id },
				data: {
					total_quantity: {
						increment: item_trans.quantity
					}
				},
			});
        }

        await tx.rR.update({
            where: { id: rr_id },
            data: {
                is_completed: true,
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_OSRIV_completion_of_approvals(tx: Prisma.TransactionClient, osriv_id: string) {

        const osriv = await tx.oSRIV.findUnique({
            where: { id: osriv_id },
            include: {
                osriv_items: {
                    include: {
                        item: true
                    }
                },
                osriv_approvers: true
            }
        })

        if(!osriv) {
            throw new NotFoundException('OSRIV not found with id: ' + osriv_id)
        }

        if(osriv.is_completed) {
			return
        }

        const hasDisapproval = osriv.osriv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

        for(let osrivItem of osriv.osriv_items) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: osrivItem.item_id,
				osriv_item_id: osrivItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: osrivItem.quantity,
				price: osrivItem.price,
				remarks: 'OSRIV Request'
			}

			itemTransactions.push(data)
		}

        // item transaction history
        await tx.itemTransaction.createMany({
            data: itemTransactions
        })

        // update is_completed in osriv
        await tx.oSRIV.update({
			where: {
				id: osriv_id
			},
			data: {
				is_completed: true,
                approval_status: APPROVAL_STATUS.APPROVED
			}
		})

        await this.update_total_qty_of_items(tx, osriv.osriv_items, ITEM_TRANSACTION_TYPE.STOCK_OUT)

    }

    private async handle_SERIV_completion_of_approvals(tx: Prisma.TransactionClient, seriv_id: string) {
        const seriv = await tx.sERIV.findUnique({
            where: { id: seriv_id },
            include: {
                seriv_items: {
                    include: {
                        item: true
                    }
                },
                seriv_approvers: true
            }
        })

        if(!seriv) {
            throw new NotFoundException('SERIV not found with id: ' + seriv_id)
        }

        if(seriv.is_completed) {
			return
        }

        const hasDisapproval = seriv.seriv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

        for(let serivItem of seriv.seriv_items) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: serivItem.item_id,
				seriv_item_id: serivItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: serivItem.quantity,
				price: serivItem.price,
				remarks: 'SERIV Request'
			}

			itemTransactions.push(data)

		}

        // item transaction history
        await tx.itemTransaction.createMany({
            data: itemTransactions
        })
        
        // update seriv

        let mwoNumber = null
        if(seriv.request_type === WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER) {
            mwoNumber = await this.commonService.generateMwoNumber();
        }

        await tx.sERIV.update({
			where: {
				id: seriv_id
			},
			data: {
				is_completed: true,
                mwo_number: mwoNumber,
                approval_status: APPROVAL_STATUS.APPROVED
			}
		})

        await this.update_total_qty_of_items(tx, seriv.seriv_items, ITEM_TRANSACTION_TYPE.STOCK_OUT)

    }

    private async handle_MRV_completion_of_approvals(tx: Prisma.TransactionClient, mrv_id: string) {

        const mrv = await tx.mRV.findUnique({
            where: { id: mrv_id },
            include: {
                mrv_approvers: true
            }
        })

        if(!mrv) {
            throw new NotFoundException('MRV not found with id: ' + mrv_id)
        }

        if(mrv.is_completed) {
			return
        }

        const hasDisapproval = mrv.mrv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

        let mwoNumber = null
        if(mrv.request_type === WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER) {
            mwoNumber = await this.commonService.generateMwoNumber();
        }

        await tx.mRV.update({
            where: { id: mrv_id },
            data: { 
                is_completed: true,
                mwo_number: mwoNumber,
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_MCT_completion_of_approvals(tx: Prisma.TransactionClient, mct_id: string) {

        const mct = await tx.mCT.findUnique({
            where: { id: mct_id },
            include: {
                mrv: {
                    include: {
                        mrv_items: {
                            include: {
                                item: true
                            }
                        },
                    }
                },
                mct_approvers: true,
            }
        })

        if(!mct) {
            throw new NotFoundException('MCT not found with id: ' + mct_id)
        }

        if(mct.is_completed) {
			return
        }

        const hasDisapproval = mct.mct_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

        const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

        for(let mrvItem of mct.mrv.mrv_items) {
            const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: mrvItem.item_id,
				mrv_item_id: mrvItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: mrvItem.quantity,
				price: mrvItem.price,
				remarks: 'MCT Request'
			}

			itemTransactions.push(data)
        }

        // item transaction history
        await tx.itemTransaction.createMany({
            data: itemTransactions
        })

        // update is_completed in mct
        await tx.mCT.update({
			where: {
				id: mct_id
			},
			data: {
				is_completed: true,
                approval_status: APPROVAL_STATUS.APPROVED
			}
		})

        await this.update_total_qty_of_items(tx, mct.mrv.mrv_items, ITEM_TRANSACTION_TYPE.STOCK_OUT)

    }

    private async handle_MCRT_completion_of_approvals(tx: Prisma.TransactionClient, mcrt_id: string) {

        const mcrt = await tx.mCRT.findUnique({
            where: { id: mcrt_id },
            include: {
                mcrt_items: {
                    include: {
                        item: true
                    }
                },
                mcrt_approvers: true,
            }
        })

        if(!mcrt) {
            throw new NotFoundException('MCRT not found with id: ' + mcrt_id)
        }

        if(mcrt.is_completed) {
			return
        }

        const hasDisapproval = mcrt.mcrt_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

        for(let mcrtItem of mcrt.mcrt_items) {
            const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: mcrtItem.item_id,
				mcrt_item_id: mcrtItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: mcrtItem.quantity,
				price: mcrtItem.price,
				remarks: 'MCRT Request'
			}

			itemTransactions.push(data)
        }

        // item transaction history
        await tx.itemTransaction.createMany({
            data: itemTransactions
        })

        // update is_completed in mcrt
        await tx.mCRT.update({
			where: {
				id: mcrt_id
			},
			data: {
				is_completed: true,
                approval_status: APPROVAL_STATUS.APPROVED
			}
		})

        await this.update_total_qty_of_items(tx, mcrt.mcrt_items, ITEM_TRANSACTION_TYPE.STOCK_IN)

    }

    private async handle_MST_completion_of_approvals(tx: Prisma.TransactionClient, mst_id: string) {

        const mst = await tx.mST.findUnique({
            where: { id: mst_id },
            include: {
                mst_items: {
                    include: {
                        item: {
                            include: {
                                item_type: true
                            }
                        }
                    }
                },
                mst_approvers: true,
            }
        })

        if(!mst) {
            throw new NotFoundException('MST not found with id: ' + mst_id)
        }

        if(mst.is_completed) {
			return
        }

        const hasDisapproval = mst.mst_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []
        const salvagedUsableItems = mst.mst_items.filter(i => i.item.code.includes("SU") && i.status === ITEM_STATUS.USABLE)
		const notSalvagedUsableItems = mst.mst_items.filter(i => !i.item.code.includes("SU") && i.status === ITEM_STATUS.USABLE)

        for(let SU_Item of salvagedUsableItems) {

			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: SU_Item.item_id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
                is_initial: true,
				quantity: SU_Item.quantity,
				price: SU_Item.price,
				remarks: 'MST Request Item is usable',
				mst_item_id: SU_Item.id,
			}

			itemTransactions.push(data)

		}

        if(itemTransactions.length > 0) {
			await tx.itemTransaction.createMany({
				data: itemTransactions
			})
		}

        // update is_completed in mst
        await tx.mST.update({
			where: {
				id: mst_id
			},
			data: {
				is_completed: true,
                approval_status: APPROVAL_STATUS.APPROVED
			}
		})

        // create new items
		for(let NSU_Item of notSalvagedUsableItems) {

			const item_transaction: Prisma.ItemTransactionCreateWithoutItemInput = {
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: NSU_Item.quantity,
				price: NSU_Item.price,
				remarks: 'Auto created with MST number ' + mst.mst_number,
				created_at: new Date(),
				created_by: 'System-generated',
			};

			const itemTypeCode = NSU_Item.item.item_type.code as ITEM_TYPE_CODE
			let itemCode = await this.itemService.generateItemCode(itemTypeCode, tx);
			itemCode = itemCode + '-SU-' + mst.mst_number

			const data: Prisma.ItemCreateInput = {
				item_type: { connect: { id: NSU_Item.item.item_type_id } },
				unit: {
				  connect: { id: NSU_Item.item.unit_id },
				},
				code: itemCode,
				description: NSU_Item.item.description,
				// initial_quantity: NSU_Item.quantity,
				total_quantity: NSU_Item.quantity,
				alert_level: 20,
				created_by: 'System-generated',
				item_transactions: {
				  create: item_transaction,
				},
			};

			await tx.item.create({ data })
		}
    
    }

    private async handle_gas_slip_completion_of_approvals(tx: Prisma.TransactionClient, gas_slip_id: string) {

        const gas_slip = await tx.gasSlip.findUnique({
            where: { id: gas_slip_id },
            include: {
                gas_slip_approvers: true,
            }
        })

        if(!gas_slip) {
            throw new NotFoundException('Gas Slip not found with id: ' + gas_slip_id)
        }

        const hasDisapproval = gas_slip.gas_slip_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

        await tx.gasSlip.update({
            where: { id: gas_slip_id },
            data: { 
                is_posted: false,
                approval_status: APPROVAL_STATUS.APPROVED
            }
        })

    }

    private async handle_trip_ticket_completion_of_approvals(tx: Prisma.TransactionClient, trip_id: string) {

        const trip = await tx.tripTicket.findUnique({
            where: { id: trip_id },
            include: {
                trip_ticket_approvers: true,
            }
        })

        if(!trip) {
            throw new NotFoundException('Trip Ticket not found with id: ' + trip_id)
        }

        const hasDisapproval = trip.trip_ticket_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
			return
        }

        await tx.tripTicket.update({
			where: {
				id: trip_id
			},
			data: {
				status: TRIP_TICKET_STATUS.APPROVED,
			}
		})

    }

    private async update_total_qty_of_items(tx: Prisma.TransactionClient, items: OSRIVItem[] | SERIVItem[] | MRVItem[] | MSTItem[] | _MCRTItem[], transaction: ITEM_TRANSACTION_TYPE) {

		// decrement total_quantity 
		// decerement quantity_on_queue
		if(transaction === ITEM_TRANSACTION_TYPE.STOCK_OUT) {

            for(let item of items) {
                await tx.item.update({
                    where: { id: item.item_id },
					data: {
						quantity_on_queue: {
							decrement: item.quantity
						},
						total_quantity: {
							decrement: item.quantity
						}
					}
                })
            }

		}

		// increment total_quantity
		if(transaction === ITEM_TRANSACTION_TYPE.STOCK_IN) {

            for(let item of items) {
                await tx.item.update({
                    where: { id: item.item_id },
					data: {
						total_quantity: {
							increment: item.quantity
						}
					}
                })
            }

		}

	}

    private async remove_queue_of_items(tx: Prisma.TransactionClient, pending: Pending): Promise<void> {

        this.logger.log('removing queue items...')

        const db_entity = pending.reference_table
        const ref_number = pending.reference_number

        if(db_entity === DB_ENTITY.OSRIV) {

            const osriv = await tx.oSRIV.findUnique({ 
                where: { osriv_number: ref_number },
                select: {
                    osriv_items: true,
                }
             })

            if(!osriv) {
                throw new NotFoundException(`OSRIV not found with reference number ${ ref_number }`)
            }

            for(let item of osriv.osriv_items) {

                await tx.item.update({
                    where: { id: item.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: item.quantity
                        }
                    }
                })

                this.logger.log(`Item's quantity_on_queue with id=${item.item_id} decremented by ${ item.quantity }`)

            }

        }

        else if(db_entity === DB_ENTITY.SERIV) {

            const seriv = await tx.sERIV.findUnique({ 
                where: { seriv_number: ref_number },
                select: {
                    seriv_items: true,
                }
             })

            if(!seriv) {
                throw new NotFoundException(`SERIV not found with reference number ${ ref_number }`)
            }

            for(let item of seriv.seriv_items) {

                await tx.item.update({
                    where: { id: item.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: item.quantity
                        }
                    }
                })

                this.logger.log(`Item's quantity_on_queue with id=${item.item_id} decremented by ${ item.quantity }`)

            }

        } 

        else if(db_entity === DB_ENTITY.MRV) {

            const mrv = await tx.mRV.findUnique({ 
                where: { mrv_number: ref_number },
                select: {
                    mrv_items: true,
                }
             })

            if(!mrv) {
                throw new NotFoundException(`MRV not found with reference number ${ ref_number }`)
            }

            for(let item of mrv.mrv_items) {

                await tx.item.update({
                    where: { id: item.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: item.quantity
                        }
                    }
                })

                this.logger.log(`Item's quantity_on_queue with id=${item.item_id} decremented by ${ item.quantity }`)

            }

        } 

        else if(db_entity === DB_ENTITY.MCT) {

            const mct = await tx.mCT.findUnique({ 
                where: { mct_number: ref_number },
                select: {
                    mrv: {
                        select: {
                            mrv_items: true
                        }
                    }
                }
             })

            if(!mct) {
                throw new NotFoundException(`MCT not found with reference number ${ ref_number }`)
            }

            for(let item of mct.mrv.mrv_items) {

                await tx.item.update({
                    where: { id: item.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: item.quantity
                        }
                    }
                })

                this.logger.log(`Item's quantity_on_queue with id=${item.item_id} decremented by ${ item.quantity }`)

            }

        } 

    }

} 
