
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

export interface Unit {
    id: string 
    name: string 
}

export interface Remarks {
    id: number 
    min: number 
    max: number 
    label: string 
    color_class: string
}

export interface WeatherCondition {
    id: string 
    code: string 
    name: string 
}

export interface Device {
    id: string 
    code: string 
    name: string 
}

export interface ActivityCategoryCauses {
    id: string 
    code?: string
    name: string 
    category_id?: number
}

export interface Equipment {
    id: string 
    category_id: number
    code: string 
    name: string 
}

export interface MeterBrand {
    id: string 
    name: string 
}

export interface ComplaintStatus {
    id: number 
    name: string 
    color_class: string 
    description: string 
}

export interface ComplaintReportType {
    id: number 
    name: string 
}

export interface ActivityCategory {
    id: number 
    name: string 
}

export interface Activity {
    id: string 
    code: string 
    category_id: number 
    unit_id: string 
    name: string
    quantity: number
    num_of_personnel: number
}

export interface TaskStatus {
    id: number 
    name: string 
    color_class: string 
    description: string 
}

export interface Shift {
    id: number,
    name: string 
    start_time: Date
    end_time: Date
    is_day_off: boolean
}