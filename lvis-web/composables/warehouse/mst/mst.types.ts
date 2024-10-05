import type { Employee } from "~/composables/system/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateMSTApprover, MSTApprover } from "./mst-approver.types";
import type { MSTItem } from "./mst-item.types";


export interface MST {
    id: string;
    mst_number: string;
    mst_date: string;

    returned_by_id: string;

    cwo_number: string | null;
    mwo_number: string | null;
    jo_number: string | null;
    
    remarks: string;


    // =============== audit fields =============== 
  
    cancelled_by: string
    created_by: string
    updated_by: string
    cancelled_at: Date
    created_at: Date
    updated_at: Date
  
  
  
    // =============== derived / resolvers =============== 

    returned_by: Employee;
    mst_approvers: MSTApprover[]
    mst_items: MSTItem[]
    status: APPROVAL_STATUS
    can_update?: boolean;
  
  }


  export interface FindAllResponse {
    data: MST[]
    totalItems: number
    currentPage: number
    totalPages: number
  }
  
  
  export interface MutationResponse {
    success: boolean
    msg: string
    data?: MST
  }
  
  export interface ChangeApproverResponse {
    success: boolean
    msg: string
    data?: MSTApprover
  }
  
  export interface UpdateItemsResponse {
    success: boolean
    msg: string
    mst_items: MSTItem[]
  }
  
  export interface CreateMstInput {
    returned_by: Employee | null
    cwo_number: string 
    mwo_number: string 
    jo_number: string 
    remarks: string 
    approvers: CreateMSTApprover[]
    items: AddMSTItem[]
  }

  export interface UpdateMstInput {
    returned_by: Employee | null
    cwo_number: string | null
    mwo_number: string | null 
    jo_number: string | null 
    remarks: string 
  }

  export interface AddMSTItem {
    itemId: string
    quantity: number
    code: string
    description: string 
    unit: Unit 
    unitPrice: number 
    showQtyError: boolean
  }
