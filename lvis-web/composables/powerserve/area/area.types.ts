import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Municipality } from "../municipality/municipality"
import type { Lineman } from "../lineman/lineman.types"



export interface Area {
    id: string 
    name: string 

    // relationships / derived
    oic: Employee
    municipalities: Municipality[]
    total_municipalities: number
    total_barangays: number
    total_sitios: number
    total_lineman: number
    linemen: Lineman[]
}