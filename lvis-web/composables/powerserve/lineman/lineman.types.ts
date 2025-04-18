import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Area } from "../area/area.types"
import type { Activity, Barangay, Remarks, Shift } from "../common"
import type { PowerInterruptionLineman } from "../task/task-detail-types/power-interruption"
import type { KwhMeterLineman } from "../task/task-detail-types/kwh-meter"
import type { LineServicesLineman } from "../task/task-detail-types/line-services"
import type { DlesLineman } from "../task/task-detail-types/dles"
import type { LmdgaLineman } from "../task/task-detail-types/lmdga"

export interface Lineman {
    id: string 
    employee_id: string 
    area_id: string 
    supervisor_id: string 
    status: LINEMAN_STATUS

    // derived
    fullname: string
    employee: Employee
    area: Area
    supervisor: Employee

    // tasks
    power_interruptions: PowerInterruptionLineman[]
    kwh_meters: KwhMeterLineman[]
    line_services: LineServicesLineman[]
    dles: DlesLineman[]
    lmdgas: LmdgaLineman[]
}

export type LinemanWithActivities = Lineman & {
    activities: LinemanActivity[]
    total_numerical_rating: number
    total_distance_travelled: number
    remark: Remarks | undefined
}

export type LinemanActivity = Activity & {
    accomplishment_qty: number 
    barangay: Barangay
    complaint_number: string | undefined
    numerical_rating: number 
    remark: Remarks | undefined
    distance_travelled_in_km: number
}

export interface CreateLineman {
    employee: Employee | null 
    area: Area | null 
    supervisor: Employee
}

export interface UpdateLineman {
    area: Area | null 
    supervisor: Employee
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

export type LinemanTask = PowerInterruptionLineman | KwhMeterLineman | LineServicesLineman | DlesLineman | LmdgaLineman

// export interface LinemanActivity {
//     activity: Activity

// }

export enum LINEMAN_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}