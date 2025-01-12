import type { Employee } from "~/composables/hr/employee/employee.types"

export interface SprApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number

  // set programmatically

  is_supervisor?: boolean
}

export interface SprApproverMutationResponse {
  success: boolean
  msg: string
  data?: SPRApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: SPRApprover[];
}

export interface SPRApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
  is_supervisor: boolean
}