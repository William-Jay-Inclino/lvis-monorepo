import type { Employee } from "~/composables/system/employee/employee.types";
import type { AddItem, Item } from "../item/item.type";
import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { CreateOSRIVApprover, OSRIVApprover } from "./osriv-approver.types";
import type { OSRIVItem } from "./osriv-item.types";
import type { Station } from "../station/station";


export interface OSRIV {
    id: string;
    osriv_number: string;
    date_requested: string;
    purpose: string;

    requested_by_id: string;
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
  
    requested_by: Employee;
    item_from: Station;
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

export interface ChangeApproverResponse {
	success: boolean
	msg: string
	data?: OSRIVApprover
}

export interface UpdateItemsResponse {
	success: boolean
	msg: string
	osriv_items: OSRIVItem[]
}


export interface CreateOsrivInput {
	purpose: string 
	requested_by: Employee | null 
	item_from: Station | null 
	approvers: CreateOSRIVApprover[]
	items: AddItem[]
}

export interface UpdateOsrivInput {
	purpose: string 
	requested_by: Employee | null 
	item_from: Station | null 
}
  