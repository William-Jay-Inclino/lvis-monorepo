import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area, Municipality } from "../common";
import type { Task, FindAllResponse, MutationResponse } from "./task.types";
import { sendRequest } from "~/utils/api"

export async function findAll(payload: { page: number, pageSize: number, created_at: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, created_at } = payload;

    let created_at2 = null

    if (created_at) {
        created_at2 = `"${created_at}"`
    }

    const query = `
        query {
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                created_at: ${created_at2},
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
                    complaint {
                        id
                        description
                    }
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

export async function findOne(id: string): Promise<Task | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `ref_number: "${id}"`
    } else {
        args = `id: ${id}`
    }

    const query = `
        query {
            task(${args}) {
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
                task_detail {
                    account_number
                    meter_number
                    landmark
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
                }
                logs {
                    remarks 
                    created_by 
                    created_at 
                    status {
                        id 
                        name 
                        color_class
                    }
                }
                tasks {
                    id
                    ref_number 
                    remarks
                    accomplishment 
                    action_taken 
                    created_at 
                    assignee {
                        id 
                        firstname
                        middlename
                        lastname
                    }
                    status {
                        id 
                        name
                        color_class
                    }
                    logs {
                        remarks 
                        created_by 
                        created_at 
                        status {
                            id 
                            name 
                            color_class
                        }
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