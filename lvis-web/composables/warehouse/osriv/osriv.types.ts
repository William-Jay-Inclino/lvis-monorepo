import type { Employee } from "~/composables/system/employee/employee.types";
import type { Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateOSRIVApprover, OSRIVApprover } from "./osriv-approver.types";
import type { CreateOSRIVItem, OSRIVItem } from "./osriv-item.types";


export interface OSRIV {
    id: string;
    osriv_number: string;
    date_requested: string;
    purpose: string;

    requested_by_id: string;
    department_id: string;
    item_from_id: string;
    supervisor_id: string;
    warehouse_custodian_id: string;
  


    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 
  
    requested_by: Employee;
    department: Department;
    item_from: Item;
    supervisor: Employee
    warehouse_custodian: Employee
    osriv_approvers: OSRIVApprover[]
    osriv_items: OSRIVItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
  
  }


  export interface FindAllResponse {
    data: OSRIV[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: OSRIV
  }
  
  
  export interface CreateOsrivInput {
    purpose: string 
    requested_by: Employee | null 
    item_from: Item | null 
    supervisor: Employee | null 
    warehouse_custodian: Employee | null 
    approvers: CreateOSRIVApprover[]
    items: CreateOSRIVItem[]
  }
  
  export interface UpdateOsrivInput {
    purpose: string 
    requested_by: Employee | null 
    item_from: Item | null 
    supervisor: Employee | null 
    warehouse_custodian: Employee | null 
  }
  