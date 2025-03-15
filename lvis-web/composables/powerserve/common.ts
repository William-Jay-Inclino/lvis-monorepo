

export interface Consumer {
    _id: string 
    name: string 
}

export interface Area {
    _id: string 
    name: string 
}

export interface Department {
    _id: string 
    name: string 
}

export interface Employee {
    id: string 
    name: string 
}

export interface Division {
    _id: string 
    department_id: string
    name: string 
}

export interface Municipality {
    _id: string 
    area_id: string 
    name: string 

    // relationships
    barangays: Barangay[]
}

export interface Barangay  {
    _id: string 
    municipality_id: string 
    name: string 

    // relationships

    municipality: Municipality
    sitios: Sitio[]
}

export interface Sitio {
    _id: string 
    barangay_id: string 
    name: string 

    // relationships

    barangay: Barangay
}

export interface Lineman {
    _id: string 
    employee_id: string 
    area_id: string 
    supervisor_id: string 
    status: number 
}

export type Assignment = (Area | Department | Division) & { type?: "area" | "department" | "division" };