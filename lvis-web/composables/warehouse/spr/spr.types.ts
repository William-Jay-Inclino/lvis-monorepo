import type { APPROVAL_STATUS, Vehicle } from "~/composables/common.types";
import type { Canvass } from "../canvass/canvass.types";
import type { MEQS } from "../../purchase/meqs/meqs.types";
import type { SPRApprover, SprApproverSettings } from "./spr-approver.types";
import type { Employee } from "~/composables/hr/employee/employee.types";

export interface SPR {
  id: string;
  spr_number: string;
  canvass_number: string;
  date_requested: string;
  canvass_id?: string | null;
  vehicle_id: string;
  classification_id: string | null;
  supervisor_id: string;
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
  vehicle: Vehicle;
  meqs?: MEQS
  spr_approvers: SPRApprover[]
  status: APPROVAL_STATUS
  classification: Classification | null;
  supervisor: Employee
  is_referenced: boolean;
  can_update?: boolean;

}


export interface FindAllResponse {
  data: SPR[]
  totalItems: number
  currentPage: number
  totalPages: number
}


export interface MutationResponse {
  success: boolean
  msg: string
  data?: SPR
}


export interface CreateSprInput {
  canvass: Canvass | null;
  vehicle: Vehicle | null;
  classification: Classification | null;
  supervisor: Employee | null;
  notes: string;
  approvers: SprApproverSettings[];
}

export interface UpdateSprInput {
  vehicle: Vehicle | null;
  classification: Classification | null;
  supervisor: Employee | null;
  notes: string;
}


