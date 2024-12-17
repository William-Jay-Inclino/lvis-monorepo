import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { MeqsSupplier } from "../meqs/meqs-supplier";
import type { PoApproverSettings } from "./po-approver.types";
import type { RR } from "../rr/rr.types";
import type { Account } from "~/composables/accounting/account/account";
import type { Employee } from "~/composables/hr/employee/employee.types";

export interface PO {
    id: string;
    meqs_supplier_id?: string | null;
    meqs_number: string;
    fund_source_id?: string | null;
    po_number: string;
    po_date: string;
    notes: string



    // =============== audit fields =============== 

    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date


    // =============== derived / resolvers =============== 

    meqs_supplier?: MeqsSupplier | null
    rrs: RR[]
    po_approvers: Approver[];
    status: APPROVAL_STATUS;
    is_referenced: boolean
    fund_source: Account | null
    can_update?: boolean
    requested_by: Employee
}

export interface CreatePoInput {
    meqs_supplier: MeqsSupplier | null
    fund_source: Account | null
    approvers: PoApproverSettings[];
    notes: string
}

export interface UpdatePoInput {
    notes: string
    fund_source: Account | null
}

export interface CreatePoApproverSubInput {
    approver_id: string;
    label: string;
    order: number;

}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: PO
}

export interface FindAllResponse {
    data: PO[]
    totalItems: number
    currentPage: number
    totalPages: number
}