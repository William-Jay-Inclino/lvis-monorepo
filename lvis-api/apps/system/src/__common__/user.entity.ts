import { Role } from "apps/system/prisma/generated/client";

export class User {
    id: string;
    username: string;
    status: number;
    role: Role
    password: string;
    permissions?: UserPermissions
    created_by: string

    user_employee?: UserEmployee
}

export interface UserEmployee {
    id: string
    user: User,
    employee: Employee
}

export interface Employee {
    id: string
    firstname: string
    middlename?: string
    lastname: string
    is_budget_officer?: boolean
    is_finance_manager?: boolean
    created_by: string
    department_id: string;
    division_id?: string;
}

export interface SystemPermissions {

    // ========= DATA MANAGEMENT ========= 
    canManageAccount?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageClassification?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageDepartment?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageEmployee?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },

}

export interface WarehousePermissions {

    // ========= PURCHASING ========= 
    canManageCanvass?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManageCanvassItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageRVApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageSPR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageSPRApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageJO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageJOApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQS?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageMEQSApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplier?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplierItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMEQSSupplierAttachment?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManagePO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManagePOApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageRRApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageRRItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageOSRIV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageOSRIVApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageOSRIVItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageSERIV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageSERIVApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageSERIVItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMRV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageMRVApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMRVItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMCT?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageMCTApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMCRT?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageMCRTApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMCRTItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMST?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        print?: boolean,
    },
    canManageMSTApprover?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
    canManageMSTItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },

    // ========= DATA MANAGEMENT ========= 
    canManageSupplier?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageUnit?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },

    canManageStation?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageProject?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },


    // ========= STOCK INVENTORY ========= 
    canManageItem?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    canManageItemType?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },

    // ========= MOTORPOOL ========= 

    canManageVehicle?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },
    
    canManageFuelType?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },

    canManageGasStation?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
        update?: boolean,
        delete?: boolean,
    },

    canManageTripTicket?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },

    canManageGasSlip?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean
    },
}

export interface UserPermissions {
    canViewSystem?: boolean
    canViewWarehouse?: boolean
    system?: SystemPermissions,
    warehouse?: WarehousePermissions,
}