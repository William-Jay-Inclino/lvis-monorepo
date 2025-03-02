

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

export interface Division {
    _id: string 
    department_id: string
    name: string 
}

export interface Municipality {
    _id: string 
    area_id: string 
    name: string 
}

export interface Barangay  {
    _id: string 
    municipality_id: string 
    name: string 
}

export interface Sitio {
    _id: string 
    barangay_id: string 
    name: string 
}

export type Assignments = (Area | Department | Division)[];