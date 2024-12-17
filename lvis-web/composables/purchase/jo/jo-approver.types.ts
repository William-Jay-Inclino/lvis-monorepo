import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/hr/employee/employee.types"

export interface JoApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number

  // set programmatically

  is_supervisor?: boolean
}

export interface JoApproverMutationResponse {
  success: boolean
  msg: string
  data?: JOApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: JOApprover[];
}

export interface JOApprover {
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