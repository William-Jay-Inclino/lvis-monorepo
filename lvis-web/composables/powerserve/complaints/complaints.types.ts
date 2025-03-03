import type { Area, Assignment, Barangay, Department, Municipality, Sitio } from "../common"


export interface Complaint {
    _id: number
    report_type_id: number
    nature_of_complaint_id: string 
    complaint_status_id: number 
    ref_number: string
    complainant_name: string
    complainant_contact_no: string | null 
    description: string 
    remarks: string
    created_at: string

    report_type?: ComplaintReportType 
    nature_of_complaint?: NatureOfComplaint 
    complaint_status?: ComplaintStatus
    assigned_to?: ComplaintAssignment
    detail?: ComplaintDetail
}

export interface CreateComplaint {
    report_type: ComplaintReportType
    nature_of_complaint: NatureOfComplaint | null 
    complainant_name: string 
    complainant_contact_number: string 
    description: string 
    remarks: string 

    detail: {
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
    _id: number 
    complaint_id: number 
    account_number: string | null 
    meter_number: string | null 
    consumer_id: string | null 
    barangay_id: string 
    sitio_id: string | null 
    landmark: string | null 

    municipality?: Municipality 
    barangay?: Barangay 
    sitio?: Sitio 
}

export interface ComplaintAssignment {
    _id: number
    complaint_id: number
    area_id: string | null
    department_id: string | null
    division_id: string | null
    assigned_at: string

    area?: Area
    department?: Department
    division?: Division 
}

export interface NatureOfComplaint {
    _id: string 
    category_id: string
    name: string
    unit: number
    quantity: number
    number_of_personnel_required: number
}

export interface ComplaintStatus {
    _id: number 
    name: string
    color_class: string
    total: number
}

export interface ComplaintReportType {
    _id: number 
    name: string
}

export interface ComplaintCategory {
    _id: number 
    name: string
}

export interface ComplaintLog {
    _id: number 
    complaint_id: number 
    complaint_status_id: number 
    remarks: string 
    updated_by: string 
    updated_at: string
}