import type { SystemPermissions, UserPermissions, WarehousePermissions } from "./user.types"


export const systemPermissions: SystemPermissions = {

    // ========= DATA MANAGEMENT ========= 
    canManageAccount: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageClassification: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageDepartment: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageEmployee: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManagePosition: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
}

export const warehousePermissions: WarehousePermissions = {

    // ========= PURCHASING ========= 
    canManageCanvass: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageRV: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageSPR: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageJO: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageMEQS: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManagePO: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageRR: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },


    // ========= WAREHOUSING ========= 
    canManageOSRIV: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },


    // ========= DATA MANAGEMENT ========= 
    canManageSupplier: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageUnit: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageVehicle: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },


    // ========= STOCK INVENTORY ========= 
    canManageItem: {
        create: false,
        search: false,
        viewDetails: false,
        update: false,
        delete: false,
    },
    canManageItemType: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
}

export const permissions: UserPermissions = {
    canViewSystem: false,
    canViewWarehouse: false,
    system: systemPermissions,
    warehouse: warehousePermissions
}


