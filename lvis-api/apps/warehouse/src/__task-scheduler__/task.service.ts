import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../__prisma__/prisma.service';
import * as moment from 'moment';
import { MRV, MRVItem, OSRIV, OSRIVItem, Prisma, SERIV, SERIVItem } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY } from '../__common__/constants';
import { APPROVAL_STATUS } from '../__common__/types';

@Injectable()
export class TasksService {

constructor(private readonly prisma: PrismaService) { }

    private readonly logger = new Logger(TasksService.name);
    private filename = 'task.service.ts'

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_osriv_expiration() {
        try {

            this.logger.log('Executing cron job for handling osriv expiration...', {
                filename: this.filename,
                function: 'handle_osriv_expiration',
            })

            return await this.prisma.$transaction(async(tx) => {

                const todayStart = moment().startOf('day').toDate(); 
                const todayEnd = moment().endOf('day').toDate();  

                const expiring_records = await this.prisma.oSRIV.findMany({
                    where: {
                        exp_date: {
                            gte: todayStart, 
                            lte: todayEnd,   
                        },
                        cancelled_at: null,
                        is_completed: false,
                        approval_status: APPROVAL_STATUS.PENDING
                    },
                    include: {
                        osriv_items: true
                    }
                })

                for(let expiring_record of expiring_records) {
                    await this.process_osriv_cancellation(expiring_record, tx as unknown as Prisma.TransactionClient)
                }

            })

            
        } catch (error) {
            this.logger.error('Error in handle_osriv_expiration', error)
        }
    }

    private async process_osriv_cancellation(osriv: OSRIV & { osriv_items: OSRIVItem[] }, tx: Prisma.TransactionClient) {

        this.logger.log(`Cancelling OSRIV no. ${ osriv.osriv_number }`)

        // cancel 

        await tx.oSRIV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: 'task-scheduler',
                note: 'Expired',
                approval_status: APPROVAL_STATUS.CANCELLED
            },
            where: { id: osriv.id }
        })
        
        // delete associated pending

        const pending = await tx.pending.findUnique({
            where: {
                reference_number_reference_table: {
                    reference_number: osriv.osriv_number,
                    reference_table: DB_ENTITY.OSRIV
                }
            }
        })

        if(pending) {
            await tx.pending.delete({
                where: { id: pending.id }
            })
            this.logger.log(`pending deleted`, `reference_table=${ pending.reference_table } reference_number=${ pending.reference_number } approver_id=${pending.approver_id}`);
        }

        // decrement item quantity base on osriv item qty 

        for(let item of osriv.osriv_items) {

            this.logger.log(`Decrementing item_id: ${ item.item_id } by ${ item.quantity } quantity`)

            await tx.item.update({
                where: { id: item.item_id },
                data: {
                    quantity_on_queue: {
                        decrement: item.quantity
                    }
                }
            })

        }

    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_seriv_expiration() {
        try {

            this.logger.log('Executing cron job for handling seriv expiration...', {
                filename: this.filename,
                function: 'handle_seriv_expiration',
            })

            return await this.prisma.$transaction(async(tx) => {

                const todayStart = moment().startOf('day').toDate(); 
                const todayEnd = moment().endOf('day').toDate();  

                const expiring_records = await this.prisma.sERIV.findMany({
                    where: {
                        exp_date: {
                            gte: todayStart, 
                            lte: todayEnd,   
                        },
                        cancelled_at: null,
                        is_completed: false,
                        approval_status: APPROVAL_STATUS.PENDING
                    },
                    include: {
                        seriv_items: true
                    }
                })

                for(let expiring_record of expiring_records) {
                    await this.process_seriv_cancellation(expiring_record, tx as unknown as Prisma.TransactionClient)
                }

            })

            
        } catch (error) {
            this.logger.error('Error in handle_seriv_expiration', error)
        }
    }

    private async process_seriv_cancellation(seriv: SERIV & { seriv_items: SERIVItem[] }, tx: Prisma.TransactionClient) {

        this.logger.log(`Cancelling SERIV no. ${ seriv.seriv_number }`)

        // cancel 

        await tx.sERIV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: 'task-scheduler',
                note: 'Expired',
                approval_status: APPROVAL_STATUS.CANCELLED
            },
            where: { id: seriv.id }
        })
        
        // delete associated pending

        const pending = await tx.pending.findUnique({
            where: {
                reference_number_reference_table: {
                    reference_number: seriv.seriv_number,
                    reference_table: DB_ENTITY.SERIV
                }
            }
        })

        if(pending) {
            await tx.pending.delete({
                where: { id: pending.id }
            })
            this.logger.log(`pending deleted`, `reference_table=${ pending.reference_table }, reference_number=${ pending.reference_number }, approver_id=${pending.approver_id}`);
        }

        // decrement item quantity base on seriv item qty 

        for(let item of seriv.seriv_items) {
            this.logger.log(`Decrementing item_id: ${ item.item_id } by ${ item.quantity } quantity`)

            await tx.item.update({
                where: { id: item.item_id },
                data: {
                    quantity_on_queue: {
                        decrement: item.quantity
                    }
                }
            })

        }

    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_mrv_expiration() {
        try {

            this.logger.log('Executing cron job for handling mrv expiration...', {
                filename: this.filename,
                function: 'handle_mrv_expiration',
            })

            return await this.prisma.$transaction(async(tx) => {

                const todayStart = moment().startOf('day').toDate(); 
                const todayEnd = moment().endOf('day').toDate();  

                const expiring_records = await this.prisma.mRV.findMany({
                    where: {
                        exp_date: {
                            gte: todayStart, 
                            lte: todayEnd,   
                        },
                        cancelled_at: null,
                        is_completed: false,
                        approval_status: APPROVAL_STATUS.PENDING
                    },
                    include: {
                        mrv_items: true
                    }
                })

                for(let expiring_record of expiring_records) {
                    await this.process_mrv_cancellation(expiring_record, tx as unknown as Prisma.TransactionClient)
                }

            })

            
        } catch (error) {
            this.logger.error('Error in handle_mrv_expiration', error)
        }
    }

    private async process_mrv_cancellation(mrv: MRV & { mrv_items: MRVItem[] }, tx: Prisma.TransactionClient) {

        this.logger.log(`Cancelling MRV no. ${ mrv.mrv_number }`)

        // cancel 

        await tx.mRV.update({
            data: {
                cancelled_at: new Date(),
                cancelled_by: 'task-scheduler',
                note: 'Expired',
                approval_status: APPROVAL_STATUS.CANCELLED
            },
            where: { id: mrv.id }
        })
        
        // delete associated pending

        const pending = await tx.pending.findUnique({
            where: {
                reference_number_reference_table: {
                    reference_number: mrv.mrv_number,
                    reference_table: DB_ENTITY.MRV
                }
            }
        })

        if(pending) {
            await tx.pending.delete({
                where: { id: pending.id }
            })
            this.logger.log(`pending deleted`, `reference_table=${ pending.reference_table }, reference_number=${ pending.reference_number }, approver_id=${pending.approver_id}`);
        }

        // decrement item quantity base on osriv item qty 

        for(let item of mrv.mrv_items) {

            this.logger.log(`Decrementing item_id: ${ item.item_id } by ${ item.quantity } quantity`)

            await tx.item.update({
                where: { id: item.item_id },
                data: {
                    quantity_on_queue: {
                        decrement: item.quantity
                    }
                }
            })

        }

    }

}