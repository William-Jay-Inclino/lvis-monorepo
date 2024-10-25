import { Role } from "apps/system/prisma/generated/client"
import { MODULES } from "apps/system/src/__common__/modules.enum"
import { RESOLVERS } from "apps/system/src/__common__/resolvers.enum"
import { User } from "apps/system/src/__common__/user.entity"

export function canAccess(user: User, module: MODULES, resolver: RESOLVERS): boolean {

    console.log('canAccess()', user)
    console.log('module', module)
    console.log('resolver', resolver)

    if (user.role === Role.ADMIN) {
        console.log('user is admin')
        return true
    }

    console.log('user is normal user')

    if (!user.permissions) {
        console.log('no user.permissions')
        return false;
    }

    // @ts-ignore
    const permissions = JSON.parse(user.permissions) as UserPermissions

    console.log('permissions', permissions)

    if (!permissions) {
        console.log('No permissions Object')
        return
    }

    if (!permissions.warehouse) {
        console.log('no permissions.warehouse')
        return false
    }

    const warehousePermissions = permissions.warehouse;

    const accessMap = {
        [MODULES.VEHICLE]: {
            [RESOLVERS.createVehicle]: warehousePermissions.canManageVehicle?.create ?? false,
            [RESOLVERS.updateVehicle]: warehousePermissions.canManageVehicle?.update ?? false,
            [RESOLVERS.removeVehicle]: warehousePermissions.canManageVehicle?.delete ?? false,
        },
        [MODULES.FUEL_TYPE]: {
            [RESOLVERS.createFuelType]: warehousePermissions.canManageFuelType?.create ?? false,
            [RESOLVERS.updateFuelType]: warehousePermissions.canManageFuelType?.update ?? false,
            [RESOLVERS.removeFuelType]: warehousePermissions.canManageFuelType?.delete ?? false,
        },
        [MODULES.TRIP_TICKET]: {
            [RESOLVERS.createTripTicket]: warehousePermissions.canManageTripTicket?.create ?? false,
            [RESOLVERS.updateTripTicket]: warehousePermissions.canManageTripTicket?.update ?? false,
            [RESOLVERS.removeTripTicket]: warehousePermissions.canManageTripTicket?.delete ?? false,
        },
    };

    return accessMap[module]?.[resolver] ?? false;
}