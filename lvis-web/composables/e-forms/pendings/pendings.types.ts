import type { DB_ENTITY } from "~/utils/constants"

export interface Pending {
    id: number
    approver_id: string 
    reference_number: string;
    reference_table: DB_ENTITY;
    description: string
    transaction_date: Date
    approver_notes: string | null
}


export interface ApproveOrDisapprovePayload {
    id: number,
    remarks: string,
    classification_id?: string | null,
    fund_source_id?: string | null,
}