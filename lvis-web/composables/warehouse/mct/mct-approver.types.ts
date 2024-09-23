import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/system/employee/employee.types"


export interface MctApproverMutationResponse {
  success: boolean
  msg: string
  data?: MCTApprover
}


export interface MCTApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export interface CreateMCTApprover {
  approver: Employee | null
  label: string
  label_id: string
  order: number
  showRequiredMsg: boolean
}