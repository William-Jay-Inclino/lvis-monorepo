import { Field, ObjectType } from "@nestjs/graphql";
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { SETTINGS } from "./constants";
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
            const _item = await this.prisma.$queryRaw<Item[]>`
                SELECT total_quantity, quantity_on_queue FROM "item" WHERE id = ${item.item_id} FOR UPDATE
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

}
