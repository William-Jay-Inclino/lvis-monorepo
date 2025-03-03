import type { Area, Assignment, Barangay, Department, Municipality, Sitio } from "../common"


export interface Complaint {
    _id: number
    report_type_id: number // d
    nature_of_complaint_id: string // d
    complaint_status_id: number 
    ref_number: string
    complainant_name: string // d
    complainant_contact_no: string | null // d
    description: string // d
    remarks: string
    created_at: string

    report_type?: ComplaintReportType // d
    nature_of_complaint?: NatureOfComplaint // d
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
    account_number: string | null // d
    meter_number: string | null // d
    consumer_id: string | null // d
    barangay_id: string // d
    sitio_id: string | null // d
    landmark: string | null // d

    municipality?: Municipality // d
    barangay?: Barangay // d
    sitio?: Sitio // d
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
}

export interface ComplaintReportType {
    _id: number 
    name: string
}

export interface ComplaintCategory {
    _id: number 
    name: string
}

