import { Complaint, Prisma } from "apps/powerserve/prisma/generated/client";
import { User } from "apps/system/prisma/generated/client";
import { MODULES } from "apps/system/src/__common__/modules.enum";
import { RESOLVERS } from "apps/system/src/__common__/resolvers.enum";
import { DB_ENTITY, MODULE_MAPPER, ModuleMapping } from "./constants";
import { NotFoundException } from "@nestjs/common";
import { Task } from "../task/entities/task.entity";


export function canAccess(user: User, module: MODULES, resolvers: RESOLVERS): boolean {
    return true
}


export async function generateReferenceNumber(
    payload: {
        db_entity: DB_ENTITY, 
        tx: Prisma.TransactionClient
    }
) {

    const { db_entity, tx } = payload

    const module = getModule(db_entity)

    const current_year = getCurrentYear()

    const latest_item = await tx[module.model].findFirst({
        where: { [module.rcNumber]: { startsWith: current_year } },
        orderBy: { [module.rcNumber]: 'desc' },
    }) as Complaint | Task

    if (latest_item) {
        const last_ref_number = latest_item[module.rcNumber]
        const lastNumericPart = parseInt(last_ref_number.slice(-5), 10);
        const newNumericPart = lastNumericPart + 1;
        return `${current_year}-${newNumericPart.toString().padStart(5, '0')}`;
    } else {
        // If no last RC number is provided, start with '00001'
        return `${current_year}-00001`;
    }
}

export function getCurrentYear(): string {
    return new Date().getFullYear().toString().slice(-2);
}

export function getModule(entity: DB_ENTITY): ModuleMapping {
    const module = MODULE_MAPPER[entity]
    if(!module) {
        throw new NotFoundException(`module not found`)
    }
    return module
}