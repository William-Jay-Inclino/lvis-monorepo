import { Field, ObjectType } from "@nestjs/graphql";
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Item } from "../item/entities/item.entity";
import { CreateMrvItemSubInput } from "../mrv/dto/create-mrv-item.sub.input";
import { CreateOsrivItemSubInput } from "../osriv/dto/create-osriv-item.sub.input";
import { CreateSerivItemSubInput } from "../seriv/dto/create-seriv-item.sub.input";

@ObjectType()
export class WarehouseRemoveResponse {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;
}


@ObjectType()
export class WarehouseCancelResponse {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => Date)
    cancelled_at: Date;

    @Field(() => String)
    cancelled_by: string;
}

@Injectable()
export class CommonService {

	constructor(private readonly prisma: PrismaService) { }

    async getExpDate(key: string): Promise<Date> {
        // Retrieve the expiration period from the settings table
        const expDatePeriod = await this.prisma.setting.findUnique({
            where: { key },
            select: { value: true },  // Assuming 'value' stores the number of days as an integer
        });
        
        if (!expDatePeriod) {
            throw new NotFoundException(`${key} not found in settings table`);
        }
        
        // Convert the value to an integer
        const periodInDays = parseInt(expDatePeriod.value, 10);
        
        if (isNaN(periodInDays)) {
            throw new Error(`Invalid expiration period value for key ${key}`);
        }
        
        // Get the current date and add the expiration period (in days)
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + periodInDays); // Add days to current date
        
        return expirationDate;
    }

    async validateItems(items: CreateOsrivItemSubInput[] | CreateSerivItemSubInput[] | CreateMrvItemSubInput[]) {

        for (const item of items) {
            // use this if id is text
            // const _item = await this.prisma.$queryRaw<Item[]>`
            //     SELECT total_quantity, quantity_on_queue FROM "item" WHERE id = ${item.item_id} FOR UPDATE
            // `;

            // use this if id is uuid
            const _item = await this.prisma.$queryRaw<Item[]>`
                SELECT total_quantity, quantity_on_queue 
                FROM "item" 
                WHERE id = CAST(${item.item_id} AS uuid) FOR UPDATE
            `;

            if (!_item || _item.length === 0) {
                throw new NotFoundException(`Item with id ${item.item_id} not found in items table`);
            }

            const availableQty = _item[0].total_quantity - _item[0].quantity_on_queue;
            if (availableQty < item.quantity) {
                throw new BadRequestException(`Insufficient quantity. Only ${availableQty} available.`);
            }
        }

    }

    /*  
        No reset limit even if the sequence exceeds 999.
        Reset happens only at the start of a new month.
        Three-digit padding ensures consistency except if it reaches 1000

    */
    async generateMwoNumber(): Promise<string> {
        const now = new Date();
        const year = now.getFullYear().toString().slice(2); // e.g., "24"
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // e.g., "12"
        const yearMonth = `${year}${month}`; // e.g., "2412"
      
        return this.prisma.$transaction(async (prisma) => {
          // Find or create the sequence tracker for the current yearMonth
          let tracker = await prisma.mwoSequenceTracker.findUnique({
            where: { yearMonth },
          });
      
          if (!tracker) {
            // New month, start sequence from 1
            tracker = await prisma.mwoSequenceTracker.create({
              data: { yearMonth, sequence: 1 },
            });
          } else {
            // Increment the sequence if it already exists
            tracker = await prisma.mwoSequenceTracker.update({
              where: { yearMonth },
              data: { sequence: { increment: 1 } },
            });
          }
      
          // Format the sequence with 3 digits minimum, without resetting at 1000
          const paddedSequence = tracker.sequence.toString().padStart(3, '0');
          return `${yearMonth}-${paddedSequence}`; // e.g., "2412-001", "2412-1000", "2412-1001"
        });
    }

}
