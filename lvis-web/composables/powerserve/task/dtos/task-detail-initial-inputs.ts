import type { PowerInterruptionInput } from "./task-detail.input.types";


export const power_interruption_initial_data: PowerInterruptionInput = {
    linemen_incharge: [],
    affected_area: '',
    feeder: null,
    cause: '',
    weather_condition: null,
    device: null,
    equipment_failed: '',
    fuse_rating: ''
}