

export interface Complaint {
    _id: number
    report_type_id: number 
    nature_of_complaint_id: string
    complaint_status_id: number 
    ref_number: string
    complainant_name: string
    complainant_contact_no: string | null
    remarks: string
    created_at: string
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
}

export interface ComplaintAssignment {
    _id: number
    complaint_id: number
    area_id: string | null
    department_id: string | null
    division_id: string | null
    assigned_at: string
}

export interface NatureOfComplaint {
    _id: number 
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

