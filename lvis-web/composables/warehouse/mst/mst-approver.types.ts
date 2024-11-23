import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/system/employee/employee.types"


export interface MstApproverMutationResponse {
  success: boolean
  msg: string
  data?: MSTApprover
}


export interface MSTApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export interface CreateMSTApprover {
  approver: Employee | null
  label: string
  order: number
  showRequiredMsg: boolean
}