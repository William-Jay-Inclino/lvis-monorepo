import type { Employee } from "~/composables/hr/employee/employee.types"


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
  order: number
  showRequiredMsg: boolean
}