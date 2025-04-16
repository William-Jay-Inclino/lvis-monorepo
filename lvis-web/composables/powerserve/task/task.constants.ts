import { dles_errors, dles_initial_data } from "./task-detail-types/dles"
import { kwh_meter_errors, kwh_meter_initial_data, type KwhMeterError } from "./task-detail-types/kwh-meter"
import { line_services_errors, line_services_initial_data } from "./task-detail-types/line-services"
import { lmdga_errors, lmdga_initial_data } from "./task-detail-types/lmdga"
import { power_interruption_errors, power_interruption_initial_data, type PowerInterruptionError } from "./task-detail-types/power-interruption"
import type { UpdateTaskInput } from "./task.dto"

export const enum TASK_STATUS {
    PENDING = 1,
    ASSIGNED = 2,
    ONGOING = 3,
    COMPLETED = 4,
    UNRESOLVED = 5,
    CANCELLED = 6,
}


export const enum ACTIVITY_CATEGORY {
    KWH_Meter = 1,
    Power_Interruption = 2,
    Line_Services = 3,
    DLES = 4,
    LMDGA = 5,
    Billing = 6,
    Line_Construction = 7,
}

export const activity_category_with_details = [
    ACTIVITY_CATEGORY.KWH_Meter,
    ACTIVITY_CATEGORY.Power_Interruption,
    ACTIVITY_CATEGORY.Line_Services,
    ACTIVITY_CATEGORY.DLES,
    ACTIVITY_CATEGORY.LMDGA,
]


export const initial_form_data: UpdateTaskInput = {
    activity: null,
    description: '',
    status: null,
    action_taken: '',
    accomplishment_qty: 0,
    acted_at: '',
    notes: '',
    attachments: [],
    task_detail: {
        kwh_meter: {...kwh_meter_initial_data},
        power_interruption: {...power_interruption_initial_data},
        line_services: {...line_services_initial_data},
        dles: {...dles_initial_data},
        lmdga: {...lmdga_initial_data},
    }
}

export interface TaskFormError {
    activity: boolean
    description: boolean
    status: boolean
    action_taken: boolean
    acted_at: boolean
    task_detail: {
        kwh_meter: KwhMeterError
        power_interruption: PowerInterruptionError
    }
}

export const initial_form_errors = {
    activity: false,
    description: false,
    status: false,
    action_taken: false,
    accomplishment_qty: false,
    acted_at: false,
    task_detail: {
        kwh_meter: {...kwh_meter_errors},
        power_interruption: {...power_interruption_errors},
        line_services: {...line_services_errors},
        dles: {...dles_errors},
        lmdga: {...lmdga_errors},
    }
}