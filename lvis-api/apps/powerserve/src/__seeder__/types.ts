
export interface Lineman {
    id: string 
    employee_id: string 
    area_id: string 
    supervisor_id: string 
}

export interface Area {
    id: string 
    oic_id: string 
    name: string 
}

export interface Municipality {
    id: string 
    area_id: string 
    name: string 
}

export interface Barangay {
    id: string 
    municipality_id: string 
    name: string 
}

export interface Sitio {
    id: string 
    barangay_id: string 
    name: string 
}

export interface Feeder {
    id: string 
    name: string 
}

export interface WeatherCondition {
    id: string 
    name: string 
}

export interface Device {
    id: string 
    name: string 
}

export interface MeterBrand {
    id: string 
    name: string 
}

export interface ComplaintStatus {
    id: number 
    name: string 
}

export interface ComplaintReportType {
    id: number 
    name: string 
}

export interface ComplaintCategory {
    id: number 
    name: string 
}

export interface NatureOfComplaint {
    id: string 
    category_id: number 
    name: string
    number_of_personnel_required: number
}

export interface TaskStatus {
    id: number 
    name: string 
}