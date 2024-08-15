import type { DEPARTMENT_STATUS } from "~/composables/common.types";


export interface Department {
    id: string;
    code: string;
    name: string;
    status: DEPARTMENT_STATUS;
}


export interface CreateDepartmentInput {
    code: string;
    name: string;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Department
}