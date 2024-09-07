import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/system/employee/employee.types"


export interface OsrivApproverMutationResponse {
  success: boolean
  msg: string
  data?: OSRIVApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: OSRIVApprover[];
}

export interface OSRIVApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
  is_supervisor: boolean
  is_warehouse_custodian: boolean
}

export interface CreateOSRIVApprover {
  approver: Employee | null
  label: string
  order: number
  is_supervisor: boolean
  is_warehouse_custodian: boolean
}