import type { Employee } from "~/composables/hr/employee/employee.types"
import type { Task, TaskStatus } from "./task.types"
import type { TASK_STATUS } from "./task.constants"
import type { Activity } from "../common"
import type { PowerInterruptionInput } from "./task-detail-types/power-interruption"
import type { KwhMeterInput } from "./task-detail-types/kwh-meter"
import type { Complaint } from "../complaint/complaint.types"
import type { LineServicesInput } from "./task-detail-types/line-services"
import type { DlesInput } from "./task-detail-types/dles"
import type { LmdgaInput } from "./task-detail-types/lmdga"


export interface AssignTaskInput {
    task: Task
    assignee: Employee
    remarks: string 
    will_start: boolean
}

export interface UpdateTaskStatusInput {
    task: Task
    status_id: TASK_STATUS,
    remarks: string 
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Task
}

export interface FindAllResponse {
    data: Task[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface UpdateTaskInput {
    create_details: boolean
    activity: Activity | null
    description: string
    status: TaskStatus | null
    action_taken: string
    acted_at: string
    notes: string
    task_detail: {
        power_interruption?: PowerInterruptionInput,
        kwh_meter?: KwhMeterInput,
        line_services?: LineServicesInput,
        dles?: DlesInput,
        lmdga?: LmdgaInput,
    }
}

export interface CreateTaskInput {
    complaint: Complaint | null,
    assignee: Employee | null,
    remarks: string
}