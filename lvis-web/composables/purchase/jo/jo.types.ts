import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { Canvass } from "../canvass/canvass.types";
import type { MEQS } from "../meqs/meqs.types";
import type { JOApprover, JoApproverSettings } from "./jo-approver.types";
import type { Employee } from "~/composables/hr/employee/employee.types";
import type { Department } from "~/composables/hr/department/department";

export interface JO {
  id: string;
  jo_number: string;
  canvass_number: string;
  date_requested: string;
  canvass_id?: string | null;
  equipment: string;
  classification_id: string | null;
  department_id: string | null;
  notes: string;



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
  jo_approvers: JOApprover[]
  status: APPROVAL_STATUS
  classification: Classification | null;
  department: Department
  supervisor: Employee
  is_referenced: boolean;
  can_update?: boolean;

}


export interface FindAllResponse {
  data: JO[]
  totalItems: number
  currentPage: number
  totalPages: number
}


export interface MutationResponse {
  success: boolean
  msg: string
  data?: JO
}


export interface CreateJoInput {
  canvass: Canvass | null;
  equipment: string;
  department: Department | null;
  classification: Classification | null;
  supervisor: Employee | null;
  notes: string;
  approvers: JoApproverSettings[];
}

export interface UpdateJoInput {
  department: Department | null;
  classification: Classification | null;
  supervisor: Employee | null;
  equipment: string;
  notes: string;
}


