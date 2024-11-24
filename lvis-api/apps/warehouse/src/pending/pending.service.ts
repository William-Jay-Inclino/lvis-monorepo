import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MRVItem, MSTItem, OSRIVItem, Pending, Prisma, PrismaClient, SERIVItem, MCRTItem as _MCRTItem } from 'apps/warehouse/prisma/generated/client';
import { PrismaService } from '../__prisma__/prisma.service';
import { APPROVAL_STATUS, ITEM_TRANSACTION_TYPE } from '../__common__/types';
import { DB_ENTITY, ITEM_TYPE_CODE, MODULE_MAPPER, ModuleMapping } from '../__common__/constants';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RrApproverStatusUpdated } from '../rr-approver/events/rr-approver-status-updated.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OsrivApproverStatusUpdated } from '../osriv-approver/events/osriv-approver-status-updated.event';
import { SerivApproverStatusUpdated } from '../seriv-approver/events/seriv-approver-status-updated.event';
import { MctApproverStatusUpdated } from '../mct-approver/events/mct-approver-status-updated.event';
import { McrtApproverStatusUpdated } from '../mcrt-approver/events/mcrt-approver-status-updated.event';
import { MrvApproverStatusUpdated } from '../mrv-approver/events/mrv-approver-status-updated.event';
import { MstApproverStatusUpdated } from '../mst/events/mst-approver-status-updated.event';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { GasSlipApproverStatusUpdated } from '../gas-slip-approver/events/gas-slip-approver-status-updated.event';
import { getModule } from '../__common__/helpers';
import { TripTicketApproverStatusUpdated } from '../trip-ticket-approver/events/trip-ticket-approver-status-updated.event';
import { MCRTItem } from '../mcrt-item/entities/mcrt-item.entity';
import { ITEM_STATUS } from '../item/entities/item.types';
import { ItemService } from '../item/item.service';
import { TRIP_TICKET_STATUS } from '../trip-ticket/entities/trip-ticket.enums';

@Injectable()
export class PendingService {

    private readonly logger = new Logger(PendingService.name)
    private authUser: AuthUser

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private eventEmitter: EventEmitter2,
        private itemService: ItemService,
    ) {}

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async findPendingsByApproverId(approverId: string): Promise<Pending[]> {
        
        const pendings = await this.prisma.pending.findMany({
            where: {
                approver_id: approverId
            },
            take: 100
        })

        return pendings

    }

    async getTotalPendingsByApproverId(approverId: string): Promise<Number> {
        
        const totalPendings = await this.prisma.pending.count({
            where: {
                approver_id: approverId
            }
        })

        console.log('totalPendings', totalPendings);

        return totalPendings

    }

    // async approveOrDisapprovePending(payload: {
    //     id: number, 
    //     status: APPROVAL_STATUS,
    //     remarks: string,
    //     classification_id?: string,
    //     fund_source_id?: string
    // })
    // : Promise<{success: boolean, msg: string}> {

    //     console.log('approveOrDisapprovePending()', payload);

    //     const {
    //         id,
    //         status,
    //         remarks,
    //         classification_id,
    //         fund_source_id,
    //     } = payload

    //     // this array will be use in the transaction
    //     const queries: Prisma.PrismaPromise<any>[] = []

    //     // use for logging
    //     const logs: string[] = []

    //     const item = await this.prisma.pending.findUnique({
    //         where: { id }
    //     })

    //     if(!item) {
    //         throw new NotFoundException('pending id not found')
    //     }

    //     // =================== UPDATE APPROVER STATUS, REMARKS/NOTES, & DATE APPROVAL =================== 

    //     const module = getModule(item.reference_table as DB_ENTITY)
        
    //     // model can be: rv/spr/jo/meqs/po/rr
    //     // @ts-ignore
    //     const model = await this.prisma[module.model].findUnique({
    //         select: {
    //             id: true,
    //         },
    //         where: {
    //             [module.rcNumber]: item.reference_number,
    //         }
    //     })

    //     if(!model) {
    //         throw new NotFoundException(`reference_number: ${item.reference_number} not found in ${item.reference_table}`)
    //     }

    //     // get the x-approver table by the current approver 
    //     // @ts-ignore
    //     const approverModel = await this.prisma[module.approverModel].findFirst({
    //     where: {
    //         approver_id: item.approver_id,
    //         [module.id]: model.id,
    //         status: APPROVAL_STATUS.PENDING
    //     },
    //     orderBy: {
    //         order: 'asc'  
    //     }
    //     });

    //     if(!approverModel) {
    //         throw new NotFoundException(`record to update not found`)
    //     }

    //     console.log('approverModel', approverModel);

    //     // @ts-ignore
    //     const updateStatusQuery = this.prisma[module.approverModel].update({
    //         where: {
    //             id: approverModel.id  
    //         },
    //         data: {
    //             status,
    //             notes: (!!remarks && remarks.trim().length > 0) ? remarks : approverModel.notes,
    //             date_approval: new Date(),
    //         },
    //     });

    //     queries.push(updateStatusQuery)
    //     logs.push('update approver status')


    //     // =================== DELETE PENDING =================== 

    //     const deletePendingQuery = this.prisma.pending.delete({
    //         where: {
    //             id: item.id
    //         }
    //     })

    //     queries.push(deletePendingQuery)
    //     logs.push('delete pending')


    //     // =================== ADD NEW PENDING IF STATUS IS APPROVE =================== 

    //     if(status === APPROVAL_STATUS.APPROVED) {

    //     // get the next in line approver
    //     // @ts-ignore
    //     const newPending = await this.prisma[module.approverModel].findFirst({
    //         select: {
    //             approver_id: true,
    //         },
    //         where: {
    //             [module.id]: model.id,
    //             status: APPROVAL_STATUS.PENDING,
    //             NOT: {
    //                 AND: [
    //                     { approver_id: item.approver_id },
    //                     { order: approverModel.order },
    //                 ]
    //             }
    //         },
    //         orderBy: {
    //             order: 'asc'
    //         }
    //     })
    
    //     if(newPending) {
    //         const addNewPendingQuery = this.prisma.pending.create({
    //         data: {
    //             approver_id: newPending.approver_id,
    //             reference_number: item.reference_number,
    //             reference_table: item.reference_table,
    //             description: `${module.description} no. ${item.reference_number}`
    //         }
    //         })
        
    //         queries.push(addNewPendingQuery)
    //         logs.push('add new pending since status is approve')
    //     }

    //     }

    //     // =================== IF CLASSIFICATION_ID IS DEFINED THEN UPDATE IT =================== 
    //     // classification_id is only available in rv, spr. and jo

    //     const canUpdateClassification = !!classification_id && (module.model === 'rV' || module.model === 'sPR' || module.model === 'jO')

    //     if( canUpdateClassification && (await this.isClassificationExist(classification_id, this.authUser)) ) {
    //         // @ts-ignore
    //         const updateClassificationQuery = this.prisma[module.model].update({
    //             data: {
    //                 classification_id,
    //             },
    //             where: {
    //                 id: model.id
    //             }
    //         })
        
    //         queries.push(updateClassificationQuery)
    //         logs.push('update classification_id')
    //     }



    //     // =================== IF FUND SOURCE ID IS DEFINED THEN UPDATE IT =================== 
    //     // fund_source_id is only available in po

    //     const canUpdateFundSource = !!fund_source_id && module.model === 'pO'

    //     if( canUpdateFundSource && (await this.isFundSourceExist(fund_source_id, this.authUser)) ){

    //         const updateFundSourceQuery = this.prisma.pO.update({
    //             data: {
    //             fund_source_id,
    //             },
    //             where: {
    //             id: model.id
    //             }
    //         })

    //         queries.push(updateFundSourceQuery)
    //         logs.push('update fund_source_id')

    //     }

    //     try {
    //         const result = await this.prisma.$transaction(queries)
            
    //         this.printLogsInConsole(logs)
            
    //         // emit event so that item will be transacted and stock qty will be added/deducted on the item inventory
    //         // handler functions are located at item.service.ts

    //         if (status === APPROVAL_STATUS.APPROVED) {
    //             const eventMap = {
    //                 [DB_ENTITY.RR]: { event: 'rr-approver-status.updated', eventClass: RrApproverStatusUpdated },
    //                 [DB_ENTITY.OSRIV]: { event: 'osriv-approver-status.updated', eventClass: OsrivApproverStatusUpdated },
    //                 [DB_ENTITY.SERIV]: { event: 'seriv-approver-status.updated', eventClass: SerivApproverStatusUpdated },
    //                 [DB_ENTITY.MRV]: { event: 'mrv-approver-status.updated', eventClass: MrvApproverStatusUpdated },
    //                 [DB_ENTITY.MCT]: { event: 'mct-approver-status.updated', eventClass: MctApproverStatusUpdated },
    //                 [DB_ENTITY.MCRT]: { event: 'mcrt-approver-status.updated', eventClass: McrtApproverStatusUpdated },
    //                 [DB_ENTITY.MST]: { event: 'mst-approver-status.updated', eventClass: MstApproverStatusUpdated },

    //                 // handler function is in gas-slip.service.ts
    //                 [DB_ENTITY.GAS_SLIP]: { event: 'gas-slip-approver-status.updated', eventClass: GasSlipApproverStatusUpdated },
    //                 // handler function is in trip-ticket.service.ts
    //                 [DB_ENTITY.TRIP_TICKET]: { event: 'trip-ticket-approver-status.updated', eventClass: TripTicketApproverStatusUpdated },
    //             };
            
    //             const entity = Object.values(DB_ENTITY).find(key => module.model === MODULE_MAPPER[key].model);
                
    //             if (entity && eventMap[entity]) {
    //                 const { event, eventClass } = eventMap[entity];
    //                 this.eventEmitter.emit(event, new eventClass(approverModel.id));
    //             }
    //         }

    //         return {
    //             success: true,
    //             msg: 'Successfully updated pending'
    //         }
    //     } catch (error) {
    //         console.log('Error', error);
    //         return {
    //             success: false,
    //             msg: error
    //         }
    //     }
    // }

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
            const pending = await this.get_pending(tx, id)
            const module = getModule(pending.reference_table as DB_ENTITY)
            const model = await this.get_model(tx, module, pending)
            const approverModel = await this.get_approver_model(tx, module, model.id, pending.approver_id)

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

            console.log('approver status and notes updated');

            // delete pending
            await tx.pending.delete({
                where: {
                    id: pending.id
                }
            })

            console.log('approver pending deleted');

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
                            description: `${module.description} no. ${pending.reference_number}`
                        }
                    })

                    console.log('new approver created in pending');

                } else {

                    console.log('is_last_approver set to true');
                    is_last_approver = true
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

                console.log('classification updated');
            
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

                console.log('fund source updated');

            }

            if(status === APPROVAL_STATUS.APPROVED && is_last_approver === true) {

                console.log('status is approved and is_last_approver');
                
                if(module.model === 'rR') {
                    console.log('module is rR');
                    await this.handle_RR_completion_of_approvals(tx, model.id)

                } else if(module.model === 'oSRIV') {
                    console.log('module is oSRIV');
                    await this.handle_OSRIV_completion_of_approvals(tx, model.id)

                } else if(module.model === 'sERIV') {
                    console.log('module is sERIV');
                    await this.handle_SERIV_completion_of_approvals(tx, model.id)

                } else if(module.model === 'mRV') {
                    console.log('module is mRV');
                    await this.handle_MRV_completion_of_approvals(tx, model.id)

                } else if(module.model === 'mCT') {
                    console.log('module is mCT');
                    await this.handle_MCT_completion_of_approvals(tx, model.id)

                } else if(module.model === 'mCRT') {
                    console.log('module is mCRT');
                    await this.handle_MCRT_completion_of_approvals(tx, model.id)

                } else if(module.model === 'mST') {
                    console.log('module is mST');
                    await this.handle_MST_completion_of_approvals(tx, model.id)

                } else if(module.model === 'gasSlip') {
                    console.log('module is gasSlip');
                    await this.handle_gas_slip_completion_of_approvals(tx, model.id)

                } else if(module.model === 'tripTicket') {
                    console.log('module is tripTicket');
                    await this.handle_trip_ticket_completion_of_approvals(tx, model.id)

                } else {
                    console.log('module has no handler for completion of approvals');
                }

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

    private async printLogsInConsole(logs: string[]) {
        for(let log of logs) {
            console.log(log);
        }
    }

    private async isClassificationExist(classification_id: string, authUser: AuthUser): Promise<boolean> {

        this.logger.log('isClassificationExist', classification_id)

        console.log('this.authUser', this.authUser)

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

        console.log('data', data)

        if (!data || !data.data || !data.data.classification) {
            console.log('classification not found')
            return false
        }
        const classification = data.data.classification
        console.log('classification', classification)
        return true

    }

    private async isFundSourceExist(fund_source_id: string, authUser: AuthUser): Promise<boolean> {

        this.logger.log('isFundSourceExist', fund_source_id)

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

        console.log('data', data)

        if (!data || !data.data || !data.data.account) {
            console.log('account not found')
            return false
        }
        const account = data.data.account
        console.log('account', account)
        return true

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
            console.log('RR is already completed. End function')
			return
        }

        const hasDisapproval = rr.rr_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('RR has disapproval. End function')
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
                is_completed: true
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
            console.log('OSRIV is already completed. End function')
			return
        }

        const hasDisapproval = osriv.osriv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('OSRIV has disapproval. End function')
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
				is_completed: true
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
            console.log('SERIV is already completed. End function')
			return
        }

        const hasDisapproval = seriv.seriv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('SERIV has disapproval. End function')
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
        
        // update is_completed in seriv
        await tx.sERIV.update({
			where: {
				id: seriv_id
			},
			data: {
				is_completed: true
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
            console.log('MRV is already completed. End function')
			return
        }

        const hasDisapproval = mrv.mrv_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('MRV has disapproval. End function')
			return
        }

        await tx.mRV.update({
            where: { id: mrv_id },
            data: { is_completed: true }
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
            console.log('MCT is already completed. End function')
			return
        }

        const hasDisapproval = mct.mct_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('MCT has disapproval. End function')
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
				is_completed: true
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
            console.log('MCRT is already completed. End function')
			return
        }

        const hasDisapproval = mcrt.mcrt_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('RR has disapproval. End function')
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
				is_completed: true
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
            console.log('MST is already completed. End function')
			return
        }

        const hasDisapproval = mst.mst_approvers.find(i => i.status !== APPROVAL_STATUS.APPROVED)

        if(hasDisapproval) {
            console.log('MST has disapproval. End function')
			return
        }

		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []
        const salvagedUsableItems = mst.mst_items.filter(i => i.item.code.includes("SU") && i.status === ITEM_STATUS.USABLE)
		const notSalvagedUsableItems = mst.mst_items.filter(i => !i.item.code.includes("SU") && i.status === ITEM_STATUS.USABLE)

        for(let SU_Item of salvagedUsableItems) {

			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: SU_Item.item_id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
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
				is_completed: true
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
				initial_quantity: NSU_Item.quantity,
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
            console.log('Gas Slip has disapproval. End function')
			return
        }

        await tx.gasSlip.update({
            where: { id: gas_slip_id },
            data: { is_posted: false }
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
            console.log('Trip Ticket has disapproval. End function')
			return
        }

        await tx.tripTicket.update({
			where: {
				id: trip_id
			},
			data: {
				status: TRIP_TICKET_STATUS.APPROVED
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

} 
