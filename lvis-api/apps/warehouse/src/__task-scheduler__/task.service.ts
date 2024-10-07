import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../__prisma__/prisma.service';
import * as moment from 'moment';
import { Prisma } from 'apps/warehouse/prisma/generated/client';
import { DB_ENTITY, MODULE_MAPPER, ModuleMapping } from '../__common__/constants';

@Injectable()
export class TasksService {

constructor(private readonly prisma: PrismaService) { }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_osriv_expiration() {
        console.log('handle_osriv_expiration');
        await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.OSRIV])
    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_seriv_expiration() {
        console.log('handle_seriv_expiration');

        await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.SERIV])
    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handle_mrv_expiration() {
        console.log('handle_mrv_expiration');

        await this.handle_expiration(MODULE_MAPPER[DB_ENTITY.MRV])
    }

    private async handle_expiration(module: ModuleMapping) {

        const todayStart = moment().startOf('day').toDate(); // Start of today (00:00:00)
        const todayEnd = moment().endOf('day').toDate();     // End of today (23:59:59)

        const expiringRecords = await this.prisma[module.model].findMany({
            where: {
                exp_date: {
                    gte: todayStart, 
                    lte: todayEnd,   
                },
                cancelled_at: null,
                is_completed: false,
            },
            include: {
                [module.items]: true,
            }
        });
    
        const queries: Prisma.PrismaPromise<any>[] = []

        for(let record of expiringRecords) {

            // cancel model
            const cancelQuery = this.prisma[module.model].update({
                data: {
                    cancelled_at: new Date(),
                    cancelled_by: 'task-scheduler',
                    note: 'Expired',
                },
                where: { id: record.id }
            })

            queries.push(cancelQuery)

            // delete all associated pendings
            const deleteAssociatedPendings = this.prisma.pending.deleteMany({
                where: {
                    reference_number: record.osriv_number
                }
            })

            queries.push(deleteAssociatedPendings)

            // update item qty (decrement based on model items qty) 

            for(let moduleItem of record[module.items]) {

                const updateItemQuery = this.prisma.item.update({
                    where: { id: moduleItem.item_id },
                    data: {
                        quantity_on_queue: {
                            decrement: moduleItem.quantity
                        }
                    }
                })

                queries.push(updateItemQuery)

            }

            const result = await this.prisma.$transaction(queries)

            console.log(`Successfully cancelled ${module.model}`, record[module.rcNumber]);

        }
    }

}