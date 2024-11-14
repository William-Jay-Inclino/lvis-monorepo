import { USER_STATUS, ROLE } from "#imports"
import type { Employee } from "../employee/employee.types"

export interface User {
    id: string
    username: string
    password: string
    firstname: string
    middlename: string
    lastname: string
    status: USER_STATUS
    role: ROLE
    permissions?: UserPermissions


    // =============== audit fields =============== 

    created_by: string
    updated_by: string
    deleted_by: string
    created_at: Date
    updated_at: Date
    deleted_at: Date



    // =============== derived / resolvers =============== 
    user_employee?: UserEmployee

}

export interface FindAllResponse {
    data: User[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface CreateUserInput {
    employee: Employee | null
    username: string
    password: string
    firstname: string
    middlename: string
    lastname: string
    role: ROLE
    permissions: UserPermissions
}


export interface UpdateUserInput {
    firstname: string
    middlename: string
    lastname: string
    role: ROLE
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: User
}


export interface UserEmployee {
    id: string
    user_id: string
    user: User
    employee_id: string
    employee: Employee
}


export interface UserPermissions {
    canViewSystem: boolean
    canViewWarehouse: boolean
    system: SystemPermissions
    warehouse: WarehousePermissions
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
    canManagePosition?: {
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
    canManageRV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManageSPR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManageJO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManageMEQS?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManagePO?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },
    canManageRR?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },


    // ========= WAREHOUSING ========= 
    canManageOSRIV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    canManageSERIV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    canManageMRV?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    canManageMCT?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    canManageMCRT?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    canManageMST?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
        print?: boolean,
    },

    // ========= DATA MANAGEMENT ========= 
    canManageSupplier?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageUnit?: {
        create?: boolean,
        read?: boolean,
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
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },


    // ========= MOTORPOOL ========= 
    canManageVehicle?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageFuelType?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageGasStation?: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
    },
    canManageTripTicket?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
    },
    canManageGasSlip?: {
        create?: boolean,
        search?: boolean,
        viewDetails?: boolean,
    },
}

