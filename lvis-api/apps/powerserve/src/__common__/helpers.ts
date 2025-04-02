import { Complaint, Prisma } from "apps/powerserve/prisma/generated/client";
import { User } from "apps/system/prisma/generated/client";
import { MODULES } from "apps/system/src/__common__/modules.enum";
import { RESOLVERS } from "apps/system/src/__common__/resolvers.enum";
import { DB_ENTITY, MODULE_MAPPER, ModuleMapping } from "./constants";
import { NotFoundException } from "@nestjs/common";
import { Task } from "../task/entities/task.entity";
import { Role } from "./types";


export function canAccess(user: User, module: MODULES, resolver: RESOLVERS): boolean {

    if (user.role === Role.ADMIN) {
        return true
    }

    if (!user.permissions) {
        return false;
    }

    // @ts-ignore
    const permissions = JSON.parse(user.permissions) as UserPermissions

    if (!permissions) {
        return
    }

    if (!permissions.powerserve) {
        return false
    }

    const powerservePermissions = permissions.powerserve;

    const accessMap = {

        // ===================== COMPLAINT ===================== 
        [MODULES.COMPLAINT]: {
            [RESOLVERS.createComplaint]: powerservePermissions.canManageComplaint?.create ?? false,
            [RESOLVERS.updateComplaint]: powerservePermissions.canManageComplaint?.update ?? false,
        },
        [MODULES.TASK]: {
            [RESOLVERS.createTask]: powerservePermissions.canManageTask?.create ?? false,
            [RESOLVERS.updateTask]: powerservePermissions.canManageComplaint?.update ?? false,
        },
        [MODULES.AREA]: {
            [RESOLVERS.createArea]: powerservePermissions.canManageArea?.create ?? false,
            [RESOLVERS.updateArea]: powerservePermissions.canManageArea?.update ?? false,
            [RESOLVERS.removeArea]: powerservePermissions.canManageArea?.delete ?? false,
        },
        [MODULES.SITIO]: {
            [RESOLVERS.createSitio]: powerservePermissions.canManageSitio?.create ?? false,
            [RESOLVERS.updateSitio]: powerservePermissions.canManageSitio?.update ?? false,
            [RESOLVERS.removeSitio]: powerservePermissions.canManageSitio?.delete ?? false,
        },
    };

    return accessMap[module]?.[resolver] ?? false;
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