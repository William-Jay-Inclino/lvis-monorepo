import type { Division } from "~/composables/hr/division/division";
import type { Municipality } from "../common";
import type { Task, TaskStatus } from "./task.types";
import { sendRequest } from "~/utils/api"
import type { Area } from "../area/area.types";
import type { FindAllResponse, UpdateTaskStatusInput, AssignTaskInput, UpdateTaskInput, CreateTaskInput, MutationResponse } from "./task.dto";
import type { Department } from "~/composables/hr/department/department";
import { get_dles_mutation_string, get_kwh_meter_mutation_string, get_line_services_mutation_string, get_lmdga_mutation_string, get_pi_mutation_string } from "./task.helpers";


export async function task_index_init(): Promise<{
    task_statuses: TaskStatus[]
}> {

    const query = `
        query {
            task_statuses {
                id 
                name
                color_class
                description
                total
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            task_statuses: response.data.data.task_statuses
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findAll(payload: { 
    page: number, 
    pageSize: number, 
    created_at: string | null, 
    assignee_id?: string | null, 
}): Promise<FindAllResponse> {

    const { page, pageSize, created_at, assignee_id } = payload;

    const created_at2 = created_at ? `"${created_at}"` : null;
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;


    const query = `
        query {
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                created_at: ${created_at2},
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
        return response.data.data.tasks;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(payload: { id?: number, ref_number?: string, with_task_details?: boolean }): Promise<Task | undefined> {

    const { id, ref_number, with_task_details } = payload

    console.log('payload', payload);

    if(!id && !ref_number) {
        console.error('Please provide id or ref_number');
        return
    }

    let args = id ? `id: ${ id }` : `ref_number: "${ ref_number }"`

    if (with_task_details) {
        args += ', with_task_details: true';
    }

    const query = `
        query {
            task(${args}) {
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
                    created_by 
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
                        consumer {
                            id 
                            name
                            meter_number
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
                task_detail_power_interruption {
                    linemen_incharge {
                        lineman {
                            id
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                    affected_area
                    feeder {
                        id 
                        name
                    }
                    cause 
                    weather_condition {
                        id 
                        name
                    }
                    device {
                        id 
                        name
                    }
                    equipment_failed
                    fuse_rating
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

export async function fetchDataInSearchFilters(): Promise<{
    tasks: Task[],
}> {
    const query = `
        query {
            tasks(page: 1, pageSize: 10) {
                data{
                    ref_number
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let tasks = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.tasks && data.tasks.data) {
            tasks = data.tasks.data
        }
        return {
            tasks,
        }

    } catch (error) {
        console.error(error);
        return {
            tasks: [],
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    municipalities: Municipality[],
    departments: Department[],
    divisions: Division[],
    areas: Area[],
}> {


    const query = `
        query {
            task_report_types{
                id
                name
            }
            municipalities {
                id 
                name 
                barangays {
                    id 
                    name 
                    sitios {
                        id 
                        name
                    }
                }
            }
            departments {
                id 
                name 
            }
            divisions {
                id 
                name 
            }
            areas {
                id 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let report_types = []
        let municipalities = []
        let departments = []
        let divisions = []
        let areas = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.task_report_types) {
            report_types = data.task_report_types
        }

        if (data.municipalities) {
            municipalities = data.municipalities
        }

        if (data.departments) {
            departments = data.departments
        }

        if (data.divisions) {
            divisions = data.divisions
        }

        if (data.areas) {
            areas = data.areas
        }

        return {
            municipalities,
            departments,
            divisions,
            areas,
        }

    } catch (error) {
        console.error(error);
        return {
            municipalities: [],
            departments: [],
            divisions: [],
            areas: [],
        }
    }


}

export async function findByRefNumber(refNumber: string): Promise<Task | undefined> {
    const query = `
        query {
            task(ref_number: "${refNumber}") {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                complainant_name
                complainant_contact_no
                description
                remarks
                created_at
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

export async function fetchRefNumbers(payload: string): Promise<Task[]> {
    const query = `
        query {
            tasks_by_ref_number(ref_number: "${payload}") {
                ref_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.tasks_by_ref_number

    } catch (error) {
        console.error(error);
        return []
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

export async function update_task(payload: { task_id: number, input: UpdateTaskInput }): Promise<MutationResponse> {

    const { task_id, input } = payload

    const status_id = input.create_details ? input.status?.id : null

    const description = input.description ? `"${input.description.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const action_taken = input.action_taken ? `"${input.action_taken.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const notes = input.notes ? `"${input.notes.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;

    const powerInterruptionInput = input.task_detail.power_interruption 
        ? get_pi_mutation_string({ input: input.task_detail.power_interruption }) 
        : null;

    const kwhMeterInput = input.task_detail.kwh_meter 
        ? get_kwh_meter_mutation_string({ input: input.task_detail.kwh_meter }) 
        : null;

    const lineServicesInput = input.task_detail.line_services 
        ? get_line_services_mutation_string({ input: input.task_detail.line_services }) 
        : null;

    const dlesInput = input.task_detail.dles 
        ? get_dles_mutation_string({ input: input.task_detail.dles }) 
        : null;

    const lmdgaInput = input.task_detail.lmdga 
        ? get_lmdga_mutation_string({ input: input.task_detail.lmdga }) 
        : null;
    
    const mutation = `
        mutation {
            update_task(
                input: {
                    task_id: ${ task_id },
                    activity_id: "${input.activity?.id || ''}",
                    status_id: ${ status_id },
                    description: ${description},
                    action_taken: ${action_taken},
                    remarks: ${notes},
                    acted_at: "${input.acted_at}",
                    ${powerInterruptionInput ? `power_interruption: ${powerInterruptionInput},` : ''}
                    ${kwhMeterInput ? `kwh_meter: ${kwhMeterInput}` : ''}
                    ${lineServicesInput ? `line_services: ${lineServicesInput}` : ''}
                    ${dlesInput ? `dles: ${dlesInput}` : ''}
                    ${lmdgaInput ? `lmdga: ${lmdgaInput}` : ''}
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

export async function create_task(payload: { input: CreateTaskInput }): Promise<MutationResponse> {

    const { input } = payload

    console.log('payload', payload);

    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const assignee_id = input.assignee ? `"${ input.assignee.id }"` : null
    const complaint_id = input.complaint ? input.complaint.id : null
    
    const mutation = `
        mutation {
            create_task(
                input: {
                    complaint_id: ${ complaint_id },
                    assignee_id: ${ assignee_id },
                    remarks: ${ remarks },
                }
            ) {
                success
                msg
                data {
                    id
                    ref_number
                    assignee {
                        id 
                        firstname
                        lastname
                    }
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

        if (response?.data?.data?.create_task) {
            return response.data.data.create_task;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to create task. Please contact the system administrator.",
        };
    }
}