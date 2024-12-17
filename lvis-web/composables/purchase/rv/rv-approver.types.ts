import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/hr/employee/employee.types"

export interface RvApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number

}

export interface RvApproverMutationResponse {
  success: boolean
  msg: string
  data?: RVApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: RVApprover[];
}

export interface RVApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}