import { APPROVAL_STATUS } from "#imports"
import type { Employee } from "~/composables/hr/employee/employee.types"


export interface MrvApproverMutationResponse {
  success: boolean
  msg: string
  data?: MRVApprover
}


export interface MRVApprover {
  id: string
  approver: Employee
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export interface CreateMRVApprover {
  approver: Employee | null
  label: string
  order: number
  showRequiredMsg: boolean
}