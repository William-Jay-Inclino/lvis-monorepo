import type { Department } from "~/composables/hr/department/department"
import type { Division } from "~/composables/hr/division/division"
import type { Area, Assignment, Barangay, Municipality, Sitio } from "../common"
import type { Task } from "../task/task.types"


export interface Complaint {
    id: number
    report_type_id: number
    complaint_status_id: number 
    broadcast_to_id: string 
    ref_number: string
    complainant_name: string
    complainant_contact_no: string | null 
    description: string 
    remarks: string
    created_at: string

    // relationships
    report_type: ComplaintReportType 
    broadcast_to: Area | Department | Division 
    status: ComplaintStatus
    complaint_detail: ComplaintDetail
    logs: ComplaintLog[]

    // on load -> inner join
    tasks: Task[]

    // on demand -> Needs to get request
    _tasks: Task[]
    
}

export interface CreateComplaintInput {
    report_type: ComplaintReportType | null
    complainant_name: string 
    complainant_contact_no: string 
    description: string 
    remarks: string 

    complaint_detail: {
        account_number: string | null 
        meter_number: string | null 
        consumer: {
            id: string,
            name: string
        } | null,
        municipality: Municipality | null
        barangay: Barangay | null
        sitio: Sitio | null  
        landmark: string  
    }

    assigned_to: Assignment | null
}

export interface ComplaintDetail {
    id: number 
    complaint_id: number 
    account_number: string | null 
    meter_number: string | null 
    consumer_id: string | null 
    barangay_id: string 
    sitio_id: string | null 
    landmark: string | null 

    // relationships
    barangay: Barangay 
    sitio?: Sitio 
    consumer?: {
        id: string 
        name: string
    }

    // set programmatically
    location?: string
}

export interface ComplaintAssignment {
    id: number
    complaint_id: number
    area_id: string | null
    department_id: string | null
    division_id: string | null
    assigned_at: string

    area?: Area
    department?: Department
    division?: Division 
}

export interface ComplaintStatus {
    id: number 
    name: string
    color_class: string
    description: string
    total: number
}

export interface ComplaintReportType {
    id: number 
    name: string
}

export interface ComplaintLog {
    id: number 
    complaint_id: number 
    complaint_status_id: number 
    remarks: string 
    created_by: string 
    created_at: string

    status?: ComplaintStatus
}

  export interface MutationResponse {
    success: boolean
    msg: string
    data?: Complaint
  }


  export interface FindAllResponse {
      data: Complaint[]
      totalItems: number
      currentPage: number
      totalPages: number
  }
  