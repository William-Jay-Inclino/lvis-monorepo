import type { Employee } from "~/composables/hr/employee/employee.types"

export interface RrApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number
}

export interface RrApproverMutationResponse {
  success: boolean
  msg: string
  data?: RRApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: RRApprover[];
}

export interface RRApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}