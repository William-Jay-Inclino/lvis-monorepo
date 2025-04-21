import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Area } from "../area/area.types"
import type { Activity, Barangay, Remarks, Shift } from "../common"
import type { PowerInterruptionLineman } from "../task/task-detail-types/power-interruption"
import type { KwhMeterLineman } from "../task/task-detail-types/kwh-meter"
import type { LineServicesLineman } from "../task/task-detail-types/line-services"
import type { DlesLineman } from "../task/task-detail-types/dles"
import type { LmdgaLineman } from "../task/task-detail-types/lmdga"
import type { Complaint } from "../complaint/complaint.types"
import type { Task } from "../task/task.types"

export interface Lineman {
    id: string 
    employee_id: string 
    area_id: string 
    supervisor_id: string 
    status: LINEMAN_STATUS
    created_at: string 
    
    // derived
    fullname: string
    employee: Employee
    area: Area
    supervisor: Employee
    total_numerical_rating: number | null
    total_distance_travelled: number | null
    remarks: Remarks | null

    // tasks
    power_interruptions: PowerInterruptionLineman[]
    kwh_meters: KwhMeterLineman[]
    line_services: LineServicesLineman[]
    dles: DlesLineman[]
    lmdgas: LmdgaLineman[]
    activities: LinemanActivity[]
}

export interface LinemanActivity {
    acted_at: string
    activity: Activity
    accomplishment_qty: number 
    barangay: Barangay
    task: Task
    numerical_rating: number 
    remarks: Remarks
    distance_travelled_in_km: number
}

export interface CreateLineman {
    employee: Employee | null 
    area: Area | null 
    supervisor: Employee | null
}

export interface UpdateLineman {
    employee: Employee | null 
    area: Area | null 
    supervisor: Employee | null
}

export interface LinemanSchedule {
    lineman: Lineman
    mon_shift: Shift
    tue_shift: Shift
    wed_shift: Shift
    thu_shift: Shift
    fri_shift: Shift
    sat_shift: Shift
    sun_shift: Shift
}

export interface UpdateLinemanSchedule {
    lineman: Lineman
    mon_shift: Shift
    tue_shift: Shift
    wed_shift: Shift
    thu_shift: Shift
    fri_shift: Shift
    sat_shift: Shift
    sun_shift: Shift
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Lineman
}

export type LinemanTask = PowerInterruptionLineman | KwhMeterLineman | LineServicesLineman | DlesLineman | LmdgaLineman


export enum LINEMAN_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}