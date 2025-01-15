// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PrismaService } from '../__prisma__/prisma.service';
// import * as moment from 'moment';
// import { Prisma } from 'apps/warehouse/prisma/generated/client';
// import { DB_ENTITY, MODULE_MAPPER, ModuleMapping } from '../__common__/constants';
// import { APPROVAL_STATUS } from '../__common__/types';

// @Injectable()
// export class TasksService {

// constructor(private readonly prisma: PrismaService) { }

//     private readonly logger = new Logger(TasksService.name);
//     private filename = 'task.service.ts'

//     // @Cron(CronExpression.EVERY_10_SECONDS)
//     @Cron(CronExpression.EVERY_DAY_AT_2AM)
//     async handle_osriv_expiration() {
//         try {
//             this.logger.log({
//                 filename: this.filename,
//                 function: 'handle_osriv_expiration',
//             })
//             await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.OSRIV])
//         } catch (error) {
//             this.logger.error('Error in handle_osriv_expiration', error)
//         }
//     }

//     // @Cron(CronExpression.EVERY_10_SECONDS)
//     @Cron(CronExpression.EVERY_DAY_AT_2AM)
//     async handle_seriv_expiration() {
//         try {
//             this.logger.log({
//                 filename: this.filename,
//                 function: 'handle_seriv_expiration',
//             })
//             await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.SERIV])
//         } catch (error) {
//             this.logger.error('Error in handle_seriv_expiration', error)
//         }
//     }

//     // @Cron(CronExpression.EVERY_10_SECONDS)
//     @Cron(CronExpression.EVERY_DAY_AT_2AM)
//     async handle_mrv_expiration() {
//         try {
//             this.logger.log({
//                 filename: this.filename,
//                 function: 'handle_mrv_expiration',
//             })
//             await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.MRV])
//         } catch (error) {
//             this.logger.error('Error in handle_mrv_expiration', error)
//         }
//     }

//     private async handle_expiration(module: ModuleMapping) {

//         const todayStart = moment().startOf('day').toDate(); // Start of today (00:00:00)
//         const todayEnd = moment().endOf('day').toDate();     // End of today (23:59:59)

//         const expiringRecords = await this.prisma[module.model].findMany({
//             where: {
//                 exp_date: {
//                     gte: todayStart, 
//                     lte: todayEnd,   
//                 },
//                 cancelled_at: null,
//                 is_completed: false,
//                 approval_status: APPROVAL_STATUS.PENDING
//             },
//             include: {
//                 [module.items]: true,
//             }
//         });
    
//         const queries: Prisma.PrismaPromise<any>[] = []

//         for(let record of expiringRecords) {

//             this.logger.log({
//                 filename: this.filename,
//                 function: 'handle_expiration',
//                 data: JSON.stringify(record),
//                 msg: `Cancelling osriv/seriv/mrv... Removing associated pendings ... Decrementing quantity_on_queue on each item...`
//             })

//             // cancel model
//             const cancelQuery = this.prisma[module.model].update({
//                 data: {
//                     cancelled_at: new Date(),
//                     cancelled_by: 'task-scheduler',
//                     note: 'Expired',
//                 },
//                 where: { id: record.id }
//             })

//             queries.push(cancelQuery)

//             // delete all associated pendings
//             const deleteAssociatedPendings = this.prisma.pending.deleteMany({
//                 where: {
//                     reference_number: record.osriv_number
//                 }
//             })

//             queries.push(deleteAssociatedPendings)

//             // update item qty (decrement based on model items qty) 

//             for(let moduleItem of record[module.items]) {

//                 const updateItemQuery = this.prisma.item.update({
//                     where: { id: moduleItem.item_id },
//                     data: {
//                         quantity_on_queue: {
//                             decrement: moduleItem.quantity
//                         }
//                     }
//                 })

//                 queries.push(updateItemQuery)

//             }

//             const result = await this.prisma.$transaction(queries)

//         }
//     }

// }