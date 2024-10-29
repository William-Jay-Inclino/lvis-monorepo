import type { Employee } from "~/composables/system/employee/employee.types"


export interface TripTicketApprover {
    id: string
    approver_id: string
    approver: Employee | null
    date_approval: string | null
    notes: string
    status: APPROVAL_STATUS,
    label: string
    order: number
  }


  export interface CreateTripTicketApprover {
    approver: Employee | null
    label: string
    order: number
    showRequiredMsg: boolean
  }