import type { DIVISION_STATUS } from "~/composables/common.types";
import type { Department } from "../department/department";
import type { UserPermissions } from "~/composables/system/user/user.types";


export interface Division {
    id: string;
    code: string;
    name: string;
    status: DIVISION_STATUS;
    permissions: UserPermissions;

    // derived / resolvers 
    department: Department
}


export interface CreateDivisionInput {
    department: Department | null
    code: string;
    name: string;
    permissions: UserPermissions;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Division
}