import type { Department } from "../hr/department/department"
import type { Division } from "../hr/division/division"
import type { Employee } from "../hr/employee/employee.types"
import type { Area } from "./area/area.types"


export interface Consumer {
    id: string 
    name: string 
}

export interface Feeder {
    id: string 
    name: string 
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

    // relationships
    employee: Employee
    fullname: string
}

export interface ActivityCategory {
    id: number 
    name: string 
}

export interface Activity {
    id: string
    category_id: number 
    name: string 

    category: ActivityCategory
}

export type Assignment = (Area | Department | Division) & { type?: "area" | "department" | "division" };