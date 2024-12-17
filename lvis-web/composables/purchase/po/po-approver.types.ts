import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/hr/employee/employee.types"

export interface PoApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number
}

export interface PoApproverMutationResponse {
  success: boolean
  msg: string
  data?: POApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: POApprover[];
}

export interface POApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}