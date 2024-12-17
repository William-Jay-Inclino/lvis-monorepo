import type { Employee } from "~/composables/hr/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateSERIVApprover, SERIVApprover } from "./seriv-approver.types";
import type { SERIVItem } from "./seriv-item.types";
import type { Station } from "../station/station";
import { WAREHOUSE_REQUEST_TYPE } from "#imports";
import type { MCRT } from "../mcrt/mcrt.types";


export interface SERIV {
    id: string;
    seriv_number: string;
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
    
    exp_date: Date
  

    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 

    mcrts: MCRT[];
    requested_by: Employee;
    withdrawn_by: Employee | null;
    is_referenced: boolean;
    item_from: Station;
    seriv_approvers: SERIVApprover[]
    seriv_items: SERIVItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
    request_type_object: {
      id: WAREHOUSE_REQUEST_TYPE,
      name: string,
    }
  }


  export interface FindAllResponse {
    data: SERIV[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: SERIV
  }

  export interface ChangeApproverResponse {
    success: boolean
    msg: string
    data?: SERIVApprover
  }
  
  export interface UpdateItemsResponse {
    success: boolean
    msg: string
    seriv_items: SERIVItem[]
  }
  
  
  export interface CreateSerivInput {
    request_type: WarehouseRequestType | null
    purpose: string 
    or_number: string | null
    cwo_number: string | null 
    jo_number: string | null
    consumer_name: string 
    location: string 
    requested_by: Employee | null 
    withdrawn_by: Employee | null 
    item_from: Station | null 
    approvers: CreateSERIVApprover[]
    items: AddItem[]
  }
  
  export interface UpdateSerivInput {
    purpose: string 
    request_type: WarehouseRequestType | null 
    requested_by: Employee | null 
    withdrawn_by: Employee | null 
    item_from: Station | null 
    or_number: string | null
    cwo_number: string | null 
    jo_number: string | null
    consumer_name: string 
    location: string 
  }
  