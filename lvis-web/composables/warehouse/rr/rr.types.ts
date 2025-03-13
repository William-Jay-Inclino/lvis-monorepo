import type { PO } from "../../purchase/po/po.types";
import type { RrApproverSettings } from "./rr-approver.types";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { RrItem } from "./rr-item.types";
import type { Employee } from "~/composables/hr/employee/employee.types";

export interface RR {
    id: string;
    po_id?: string | null;
    po_number: string;
    rr_number: string;
    rr_date: Date;
    received_by_id: string;
    invoice_number: string;
    delivery_number: string;
    notes: string;
    delivery_charge: number;
    is_completed: boolean




    // =============== audit fields =============== 

    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date



    // =============== derived / resolvers =============== 

    po?: PO | null;
    rr_approvers: Approver[];
    rr_items: RrItem[]
    status: APPROVAL_STATUS;
    received_by: Employee;
    requested_by: Employee | null;
    can_update?: boolean
}



export interface CreateRrInput {
    po: PO | null;
    received_by: Employee | null;
    invoice_number: string;
    delivery_number: string;
    notes: string;
    delivery_charge: number;
    approvers: RrApproverSettings[];
    rr_items: RrItem[];
}

export interface UpdateRrInput {
    received_by: Employee | null;
    invoice_number: string;
    delivery_number: string;
    notes: string;
    delivery_charge: number;
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: RR
}

export interface FindAllResponse {
    data: RR[]
    totalItems: number
    currentPage: number
    totalPages: number
}