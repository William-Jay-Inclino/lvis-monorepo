import type { UserPermissions } from "./user.types";


// sundon and defaultPermissions nga object og eh set ang value if naa silay pareha na property
// gamit ni sya if ge update nato ang defaultPermissions unya nag mismatch na sila of property sa permissions ni user

export function mergeUserPermissions(defaultPermissions: UserPermissions, userPermissions: Partial<UserPermissions>): UserPermissions {
    const mergedPermissions: UserPermissions = {
        canViewSystem: userPermissions.canViewSystem !== undefined ? userPermissions.canViewSystem : defaultPermissions.canViewSystem,
        canViewWarehouse: userPermissions.canViewWarehouse !== undefined ? userPermissions.canViewWarehouse : defaultPermissions.canViewWarehouse,
        system: { ...defaultPermissions.system },
        warehouse: { ...defaultPermissions.warehouse },
    };

    for (const key in defaultPermissions.system) {
        if (Object.hasOwnProperty.call(defaultPermissions.system, key)) {
            // @ts-ignore
            const defaultPermission = defaultPermissions.system[key];
            // @ts-ignore
            const userPermission = userPermissions.system?.[key];

            if (userPermission) {
                // @ts-ignore
                mergedPermissions.system[key] = { ...defaultPermission, ...userPermission };
            }
        }
    }

    for (const key in defaultPermissions.warehouse) {
        if (Object.hasOwnProperty.call(defaultPermissions.warehouse, key)) {
            // @ts-ignore
            const defaultPermission = defaultPermissions.warehouse[key];
            // @ts-ignore
            const userPermission = userPermissions.warehouse?.[key];

            if (userPermission) {
                // @ts-ignore
                mergedPermissions.warehouse[key] = { ...defaultPermission, ...userPermission };
            }
        }
    }

    return mergedPermissions;
}