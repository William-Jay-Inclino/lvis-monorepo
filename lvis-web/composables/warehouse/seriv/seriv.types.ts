import type { Employee } from "~/composables/system/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateSERIVApprover, SERIVApprover } from "./seriv-approver.types";
import type { SERIVItem } from "./seriv-item.types";
import type { Station } from "../station/station";
import { WAREHOUSE_REQUEST_TYPE } from "#imports";


export interface SERIV {
    id: string;
    seriv_number: string;
    date_requested: string;
    purpose: string;

    request_type: WAREHOUSE_REQUEST_TYPE
    mwo_number: string;
    jo_number: string;
    consumer_name: string;
    location: string;
    
    requested_by_id: string;
    item_from_id: string;
  

    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 
  
    requested_by: Employee;
    item_from: Station;
    seriv_approvers: SERIVApprover[]
    seriv_items: SERIVItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
  
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
  
  
  export interface CreateSerivInput {
    request_type: {
      id: WAREHOUSE_REQUEST_TYPE,
      name: string
    }
    purpose: string 
    requested_by: Employee | null 
    item_from: Item | null 
    approvers: CreateSERIVApprover[]
    items: AddItem[]
  }
  
  // export interface UpdateOsrivInput {
  //   purpose: string 
  //   requested_by: Employee | null 
  //   item_from: Item | null 
  //   supervisor: Employee | null 
  //   warehouse_custodian: Employee | null 
  // }
  