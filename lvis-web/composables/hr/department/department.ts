import type { DEPARTMENT_STATUS } from "~/composables/common.types";
import type { UserPermissions } from "../user/user.types";


export interface Department {
    id: string;
    code: string;
    name: string;
    status: DEPARTMENT_STATUS;

    permissions: UserPermissions;
    divisions: Division[]
}


export interface CreateDepartmentInput {
    code: string;
    name: string;
    permissions: UserPermissions;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Department
}