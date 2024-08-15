import type { DB_ENTITY } from "~/utils/constants"

// export enum PENDING_APPROVAL_TYPE {
//     RV = 'RV',
//     SPR = 'SPR',
//     JO = 'JO',
//     MEQS = 'MEQS',
//     PO = 'PO',
//     RR = 'RR'
// }

// export enum PENDING_TRANSACTION {
//     APPROVE = 'Approve',
//     DISAPPROVE = 'Disapprove',
// }

// export interface PendingApproval {
//     id: string
//     type: PENDING_APPROVAL_TYPE
//     description: string
//     // id of either rv, meqs, po, rr
//     reference_id: string
//     transaction_date: Date
// }

export interface Pending {
    id: string
    approver_id: string 
    reference_number: string;
    reference_table: DB_ENTITY;
    description: string
    transaction_date: Date
}

// export const enum APPROVER_TYPE {
//     COMMON = 'common',
//     BUDGET_OFFICER = 'budger_officer',
//     FINANCE_MANAGER = 'finance_manager',
// }

export interface ApproveOrDisapprovePayload {
    id: string,
    remarks: string,
    classification_id?: string | null,
    fund_source_id?: string | null,
}