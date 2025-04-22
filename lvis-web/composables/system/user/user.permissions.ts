import type { PowerservePermissions, SystemPermissions, UserPermissions, WarehousePermissions } from "./user.types"


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
    canManageDivision: {
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
    canManageSERIV: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageMRV: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageMCT: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageMCRT: {
        create: false,
        search: false,
        viewDetails: false,
        print: false,
    },
    canManageMST: {
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
    canManageProject: {
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


    // ========= MOTORPOOL ========= 
    canManageMotorpoolDashboard: {
        viewPMS: false,
        viewTrips: false,
    },
    canManageVehicle: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageVehicleMaintenance: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageVehicleService: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageFuelType: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageGasStation: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },
    canManageTripTicket: {
        create: false,
        search: false,
        viewDetails: false,
    },
    canManageGasSlip: {
        create: false,
        search: false,
        viewDetails: false,
    },

}

export const powerservePermissions: PowerservePermissions = {

    canManageComplaint: {
        create: false,
        read: false,
        update: false,
        viewDetails: false,
    },

    canManageTask: {
        create: false,
        read: false,
        update: false,
        view: false,
    },
    canManageMyTask: {
        manage: false,
    },

    canManageArea: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },

    canManageMunicipality: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },

    canManageBarangay: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },

    canManageSitio: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },

    canManageLineman: {
        create: false,
        read: false,
        update: false,
        delete: false,
    },

    canManageLinemanSchedule: {
        manage: false,
    },

    canManageLinemanEvaluation: {
        manage: false,
    },

}

export const permissions: UserPermissions = {
    canViewSystem: false,
    canViewWarehouse: false,
    system: systemPermissions,
    warehouse: warehousePermissions,
    powerserve: powerservePermissions
}


