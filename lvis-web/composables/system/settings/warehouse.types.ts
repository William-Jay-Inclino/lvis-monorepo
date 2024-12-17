import type { Employee } from "~/composables/hr/employee/employee.types"



export interface ApproverSetting {
    id: string
    approver: Employee | null
    label: string
    order: number
}


export interface CreateApproverSetting {
    approver: Employee | null
    label: string
    order: number
}


export interface UpdateApproverSetting {
    id: string
    approver: Employee | null
    label: string
}


export interface ApproverMutationResponse {
    success: boolean
    msg: string
    data?: ApproverSetting
}

export interface UpdateApproverOrderResponse {
    success: boolean;
    msg: string;
    approvers: ApproverSetting[];
}