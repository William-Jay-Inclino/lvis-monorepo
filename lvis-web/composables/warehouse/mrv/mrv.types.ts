import type { Employee } from "~/composables/system/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS, Project } from "~/composables/common.types";
import type { CreateMRVApprover, MRVApprover } from "./mrv-approver.types";
import type { MRVItem } from "./mrv-item.types";
import type { Station } from "../station/station";
import { WAREHOUSE_REQUEST_TYPE } from "#imports";
import type { MCT } from "../mct/mct.types";


export interface MRV {
    id: string;
    project_id: string;
    mrv_number: string;
    date_requested: string;
    purpose: string;

    request_type: WAREHOUSE_REQUEST_TYPE
    or_number: string | null;
    mwo_number: string | null;
    cwo_number: string | null;
    jo_number: string;
    consumer_name: string;
    location: string;
    
    requested_by_id: string;
    withdrawn_by_id: string | null;
    item_from_id: string;
  

    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 
    
    mct: MCT | undefined;
    requested_by: Employee;
    is_referenced: boolean;
    withdrawn_by: Employee | null;
    item_from: Station;
    project: Project
    mrv_approvers: MRVApprover[]
    mrv_items: MRVItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
    request_type_object: {
      id: WAREHOUSE_REQUEST_TYPE,
      name: string,
    }
  }


  export interface FindAllResponse {
    data: MRV[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: MRV
  }

  export interface UpdateItemsResponse {
    success: boolean
    msg: string
    mrv_items: MRVItem[]
  }
  
  export interface ChangeApproverResponse {
    success: boolean
    msg: string
    data?: MRVApprover
  }
  
  export interface CreateMrvInput {
    request_type: WarehouseRequestType | null
    project: Project | null
    purpose: string 
    or_number: string | null
    mwo_number: string | null 
    cwo_number: string | null 
    jo_number: string 
    consumer_name: string 
    location: string 
    requested_by: Employee | null 
    withdrawn_by: Employee | null 
    item_from: Station | null 
    approvers: CreateMRVApprover[]
    items: AddItem[]
  }
  

  export interface UpdateMrvInput {
    project: Project | null
    purpose: string 
    request_type: WarehouseRequestType | null
    requested_by: Employee | null 
    withdrawn_by: Employee | null 
    item_from: Station | null 
    or_number: string | null
    mwo_number: string | null 
    cwo_number: string | null 
    jo_number: string | null
    consumer_name: string 
    location: string 
  }