import type { Employee } from "~/composables/system/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateMCRTApprover, MCRTApprover } from "./mcrt-approver.types";
import type { MCRTItem } from "./mcrt-item.types";
import type { Station } from "../station/station";
import { WAREHOUSE_REQUEST_TYPE } from "#imports";
import type { MCT } from "../mct/mct.types";
import type { SERIV } from "../seriv/seriv.types";


export interface MCRT {
    id: string;
    mct_id: string | null;
    seriv_id: string | null;
    mcrt_number: string;
    mcrt_date: string;

    returned_by_id: string;

    wo_number: string | null;
    mo_number: string | null;
    jo_number: string | null;
    
    note: string;


    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 

    mct: MCT | null
    seriv: SERIV | null
    returned_by: Employee;
    mcrt_approvers: MCRTApprover[]
    mcrt_items: MCRTItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
  
  }


  export interface FindAllResponse {
    data: MCRT[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: MCRT
  }
  
  
  export interface CreateMcrtInput {
    mct: MCT | null
    seriv: SERIV | null
    returned_by: Employee | null
    wo_number: string 
    mo_number: string 
    jo_number: string 
    note: string 
    approvers: CreateMCRTApprover[]
    items: AddItem[]
  }
  
  