import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { Canvass } from "../canvass/canvass.types";
import type { RVApprover, RvApproverSettings } from "./rv-approver.types";
import type { MEQS } from "../../purchase/meqs/meqs.types";
import type { Employee } from "~/composables/hr/employee/employee.types";

export interface RV {
  id: string;
  rv_number: string;
  canvass_number: string;
  canvass_id?: string | null;
  classification_id: string | null;
  date_requested: string;
  work_order_no: string;
  work_order_date: string;
  notes: string;
  approval_status: APPROVAL_STATUS



  // =============== audit fields =============== 

  cancelled_by: string
  created_by: string
  updated_by: string
  cancelled_at: Date
  created_at: Date
  updated_at: Date



  // =============== derived / resolvers =============== 

  canvass?: Canvass | null;
  meqs?: MEQS
  rv_approvers: RVApprover[]
  status: APPROVAL_STATUS
  classification: Classification | null;
  supervisor: Employee
  is_referenced: boolean;
  can_update?: boolean;

}


export interface FindAllResponse {
  data: RV[]
  totalItems: number
  currentPage: number
  totalPages: number
}


export interface MutationResponse {
  success: boolean
  msg: string
  data?: RV
}


export interface CreateRvInput {
  canvass: Canvass | null;
  classification: Classification | null;
  supervisor: Employee | null;
  work_order_no: string;
  work_order_date: string | null;
  notes: string;
  approvers: RvApproverSettings[];
}

export interface UpdateRvInput {
  classification: Classification | null;
  supervisor: Employee | null;
  work_order_no: string;
  work_order_date: string | null;
  notes: string;
}


