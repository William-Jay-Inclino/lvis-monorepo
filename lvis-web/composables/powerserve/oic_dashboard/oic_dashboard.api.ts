import type { Employee } from "~/composables/hr/employee/employee.types";
import type { Complaint } from "../complaint/complaint.types";
import type { FindAllResponse, Task, TaskStatus } from "../task/task.types";
import type { Lineman } from "../common";

export async function init_data(payload: {
    page: number, 
    pageSize: number, 
    created_at: string | null, 
    assignee_id?: string | null, 
}): Promise<{ 
    find_tasks_response: FindAllResponse,
    escalated_complaints: Complaint[],
    task_statuses: TaskStatus[],
    pending_tasks: Task[],
    employees: Employee[],
    linemen: Lineman[]
}> {

    const { page, pageSize, created_at, assignee_id } = payload

    const created_at2 = created_at ? `"${created_at}"` : null;
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            escalated_complaints_by_group {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                description
                created_at
                created_by
            }
            employees_by_current_user {
                id
                firstname
                middlename
                lastname
            }
            linemen_by_current_user {
                id 
                employee {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
            task_statuses {
                id 
                name
                color_class
                description
                total_count_by_group
            }
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
                created_by
            }
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                created_at: ${created_at2},
                assignee_id: ${assignee_id2},
                by_group: true
            ) {
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
                    created_by
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
            escalated_complaints: response.data.data.escalated_complaints_by_group,
            employees: response.data.data.employees_by_current_user,
            linemen: response.data.data.linemen_by_current_user,
            task_statuses: response.data.data.task_statuses,
            pending_tasks: response.data.data.pending_tasks_by_group,
            find_tasks_response: response.data.data.tasks,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function get_tasks_and_task_statuses(payload: {
    page: number, 
    pageSize: number, 
    created_at: string | null, 
    assignee_id?: string | null, 
}): Promise<{ 
    find_tasks_response: FindAllResponse,
    task_statuses: TaskStatus[],
}> {

    const { page, pageSize, created_at, assignee_id } = payload

    const created_at2 = created_at ? `"${created_at}"` : null;
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            task_statuses {
                id 
                name
                color_class
                description
                total_count_by_group
            }
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                created_at: ${created_at2},
                assignee_id: ${assignee_id2},
            ) {
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
            task_statuses: response.data.data.task_statuses,
            find_tasks_response: response.data.data.tasks,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}