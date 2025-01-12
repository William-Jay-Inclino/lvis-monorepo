import type { Employee } from "~/composables/hr/employee/employee.types"


export interface McrtApproverMutationResponse {
  success: boolean
  msg: string
  data?: MCRTApprover
}


export interface MCRTApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export interface CreateMCRTApprover {
  approver: Employee | null
  label: string
  order: number
  showRequiredMsg: boolean
}