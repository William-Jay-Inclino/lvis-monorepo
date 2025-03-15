import type { Department } from "../hr/department/department"
import type { Division } from "../hr/division/division"
import type { Employee } from "../hr/employee/employee.types"


export interface Consumer {
    id: string 
    name: string 
}

export interface Area {
    id: string 
    name: string 

    // relationships / derived
    oic: Employee
    municipalities: Municipality[]
    total_municipalities: number
    total_barangays: number
    total_sitios: number
}

export interface Municipality {
    id: string 
    area_id: string 
    name: string 

    // relationships
    area: Area
    barangays: Barangay[]
}

export interface Barangay  {
    id: string 
    municipality_id: string 
    name: string 

    // relationships

    municipality: Municipality
    sitios: Sitio[]
}

export interface Sitio {
    id: string 
    barangay_id: string 
    name: string 

    // relationships

    barangay: Barangay
}

export interface Lineman {
    id: string 
    employee_id: string 
    area_id: string 
    supervisor_id: string 
    status: number 
}

export type Assignment = (Area | Department | Division) & { type?: "area" | "department" | "division" };