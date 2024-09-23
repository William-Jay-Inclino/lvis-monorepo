import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateMCTApprover, MCTApprover } from "./mct-approver.types";
import type { MRV } from "../mrv/mrv.types";


export interface MCT {
    id: string;
    mrv_id: string;
    mct_number: string;
    mct_date: string;

    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 
    mrv: MRV;  
    mct_approvers: MCTApprover[]
    status: APPROVAL_STATUS
    can_update?: boolean;
  
  }


  export interface FindAllResponse {
    data: MCT[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: MCT
  }
  
  
  export interface CreateMctInput {
    mrv: MRV | null
    approvers: CreateMCTApprover[]
  }
  