

export interface Remarks {
    id: number 
    min: number 
    max: number 
    label: string 
    color_class: string
}

export interface Feeder {
    id: string 
    name: string 
}

export interface Equipment {
    id: string 
    name: string 
}

export interface ActivityCategoryCause {
    id: string 
    code: string
    name: string
    category_id: number 
}

export interface Substation {
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


export interface ActivityCategory {
    id: number 
    name: string 
}

export interface Activity {
    id: string
    category_id: number 
    unit_id: string
    code: string 
    name: string 
    quantity: number 
    num_of_personnel: number 

    category: ActivityCategory
    unit: PowerserveUnit
}

export interface PowerserveUnit {
    id: string 
    name: string 
}

// export type Assignment = (Area | Department | Division) & { type?: "area" | "department" | "division" };