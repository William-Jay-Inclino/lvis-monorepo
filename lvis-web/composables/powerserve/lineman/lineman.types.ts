import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Area } from "../area/area.types"
import type { Shift } from "../common"
import type { TaskDetailPowerInterruption } from "../task/task-detail-types/power-interruption"
import type { TaskDetailKwhMeter } from "../task/task-detail-types/kwh-meter"
import type { TaskDetailLineServices } from "../task/task-detail-types/line-services"
import type { TaskDetailDles } from "../task/task-detail-types/dles"
import type { TaskDetailLmdga } from "../task/task-detail-types/lmdga"

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
    power_interruptions: TaskDetailPowerInterruption[]
    kwh_meters: TaskDetailKwhMeter[]
    line_services: TaskDetailLineServices[]
    dles: TaskDetailDles[]
    lmdgas: TaskDetailLmdga[]
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

export enum LINEMAN_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}