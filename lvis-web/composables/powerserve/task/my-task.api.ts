import type { Activity, Device, Feeder, Lineman, WeatherCondition } from "../common";
import type { AssignTaskInput, FindAllResponse, MutationResponse, Task, TaskStatus, UpdateTaskInput, UpdateTaskStatusInput } from "./task.types";


export async function init_data(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
}): Promise<{ 
    pending_tasks: Task[],
    task_statuses: TaskStatus[],
    activities: Activity[],
    linemen: Lineman[],
    feeders: Feeder[],
    weather_conditions: WeatherCondition[],
    devices: Device[],
    tasks_by_assignee_response: FindAllResponse,
}> {

    const { assignee_id, page, pageSize } = payload
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            pending_tasks_by_group {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                description
                created_at
            }
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                assignee_id: ${assignee_id2},
            ) {
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                }
                totalItems
                currentPage
                totalPages
            }
            task_statuses {
                id 
                name
                color_class
                description
                total_count_by_assignee
            }
            activities {
                id 
                name 
                category {
                    id 
                    name
                }
            }
            linemen {
                id 
                employee {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
            feeders {
                id 
                name
            }
            weather_conditions {
                id 
                name
            }
            devices {
                id 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            pending_tasks: response.data.data.pending_tasks_by_group,
            tasks_by_assignee_response: response.data.data.tasks,
            task_statuses: response.data.data.task_statuses,
            activities: response.data.data.activities,
            linemen: response.data.data.linemen,
            feeders: response.data.data.feeders,
            weather_conditions: response.data.data.weather_conditions,
            devices: response.data.data.devices,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function get_tasks_by_assignee(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
}): Promise<{ 
    tasks_by_assignee_response: FindAllResponse,
}> {

    const { assignee_id, page, pageSize } = payload
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                assignee_id: ${assignee_id2},
            ) {
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                }
                totalItems
                currentPage
                totalPages
            }
            
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            tasks_by_assignee_response: response.data.data.tasks,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function assign_task(input: AssignTaskInput): Promise<MutationResponse> {

    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    
    const mutation = `
        mutation {
            assign_task(
                input: {
                    task_id: ${ input.task.id }
                    assignee_id: "${ input.assignee.id }"
                    remarks: ${ remarks },
                    will_start: ${ input.will_start },
                }
            ) {
                success
                msg
                data {
                    id
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.assign_task) {
            return response.data.data.assign_task;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to assign task. Please contact the system administrator.",
        };
    }
}

export async function get_task_with_complaint(payload: { id: number }): Promise<Task | undefined> {
    
    const { id } = payload

    const query = `
        query {
            task(id: ${ id }) {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                activity {
                    id 
                    name
                }
                description
                created_at
                complaint {
                    id
                    ref_number 
                    complainant_name
                    complainant_contact_no
                    description 
                    remarks
                    created_at 
                    report_type {
                        id 
                        name
                    }
                    status {
                        id 
                        name 
                        color_class
                    }
                    complaint_detail {
                        id 
                        account_number 
                        meter_number 
                        consumer {
                            id 
                            name
                        }
                        barangay {
                            id 
                            name 
                            municipality {
                                id 
                                name
                            }
                        }
                        sitio {
                            id 
                            name 
                        }
                        landmark
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.task) {
            return response.data.data.task;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function get_task_with_details(payload: { id: number }): Promise<Task | undefined> {
    
    const { id } = payload

    const query = `
        query {
            task(id: ${ id }, with_task_details: true) {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                activity {
                    id 
                    name
                }
                description
                remarks
                accomplishment
                action_taken
                created_at
                complaint {
                    id
                    ref_number 
                    complainant_name
                    complainant_contact_no
                    description 
                    remarks
                    created_at 
                    report_type {
                        id 
                        name
                    }
                    status {
                        id 
                        name 
                        color_class
                    }
                    assigned_group {
                        id
                        name
                    }
                    complaint_detail {
                        id 
                        account_number 
                        meter_number 
                        consumer {
                            id 
                            name
                        }
                        barangay {
                            id 
                            name 
                            municipality {
                                id 
                                name
                            }
                        }
                        sitio {
                            id 
                            name 
                        }
                        landmark
                    }
                    logs {
                        id 
                        created_by
                        created_at
                        status {
                            id 
                            name
                            color_class
                        }
                        remarks
                    }
                }
                activity {
                    id 
                    name
                }
                assignee {
                    id
                    firstname
                    middlename
                    lastname
                }
                logs {
                    id 
                    created_by
                    created_at
                    status {
                        id 
                        name
                        color_class
                    }
                    remarks
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.task) {
            return response.data.data.task;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function update_task_status(input: UpdateTaskStatusInput): Promise<MutationResponse> {

    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    
    const mutation = `
        mutation {
            update_task_status(
                input: {
                    task_status_id: ${ input.status_id }
                    task_id: ${ input.task.id }
                    remarks: ${ remarks },
                }
            ) {
                success
                msg
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.update_task_status) {
            return response.data.data.update_task_status;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update task status. Please contact the system administrator.",
        };
    }
}

export async function update_task(payload: { task_id: number, input: UpdateTaskInput }): Promise<MutationResponse> {

    const { task_id, input } = payload

    const description = input.description ? `"${input.description.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const action_taken = input.action_taken ? `"${input.action_taken.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const notes = input.notes ? `"${input.notes.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;

    const powerInterruptionInput = input.task_detail.power_interruption ? `{
        lineman_incharge_id: "${input.task_detail.power_interruption.lineman_incharge?.id}",
        affected_area: "${input.task_detail.power_interruption.affected_area}",
        feeder_id: "${input.task_detail.power_interruption.feeder?.id}",
        cause: "${input.task_detail.power_interruption.cause}",
        weather_condition_id: "${input.task_detail.power_interruption.weather_condition?.id}",
        device_id: "${input.task_detail.power_interruption.device?.id}",
        equipment_failed: "${input.task_detail.power_interruption.equipment_failed}",
        fuse_rating: "${input.task_detail.power_interruption.fuse_rating}"
    }` : null;

    const kwhMeterInput = input.task_detail.kwh_meter ? `{
        lineman_incharge_id: "${input.task_detail.kwh_meter.lineman_incharge?.id}",
        meter_number: "${input.task_detail.kwh_meter.meter_number}",
        meter_brand_id: "${input.task_detail.kwh_meter.meter_brand?.id}",
        last_reading: "${input.task_detail.kwh_meter.last_reading}",
        initial_reading: "${input.task_detail.kwh_meter.initial_reading}",
        meter_class: "${input.task_detail.kwh_meter.meter_class}"
    }` : null;
    
    const mutation = `
        mutation {
            update_task(
                input: {
                    task_id: ${ task_id },
                    activity_id: "${input.activity?.id || ''}",
                    status_id: ${input.status?.id || null},
                    description: ${description},
                    action_taken: ${action_taken},
                    remarks: ${notes},
                    acted_at: "${input.acted_at}",
                    ${powerInterruptionInput ? `power_interruption: ${powerInterruptionInput},` : ''}
                    ${kwhMeterInput ? `kwh_meter: ${kwhMeterInput}` : ''}
                }
            ) {
                success
                msg
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                }
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.update_task) {
            return response.data.data.update_task;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update task. Please contact the system administrator.",
        };
    }
}
