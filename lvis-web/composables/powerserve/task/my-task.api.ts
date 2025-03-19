import type { AssignTaskInput, FindAllResponse, MutationResponse, Task, TaskStatus } from "./task.types";


export async function init_data(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
}): Promise<{ 
    pending_tasks: Task[],
    task_statuses: TaskStatus[],
    tasks_by_assignee_response: FindAllResponse
}> {

    const { assignee_id, page, pageSize } = payload
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            task_statuses {
                id 
                name
                color_class
                description
                total_count_by_assignee
            }
            pending_tasks_by_group {
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
            pending_tasks: response.data.data.pending_tasks_by_group,
            tasks_by_assignee_response: response.data.data.tasks,
            task_statuses: response.data.data.task_statuses,
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
    tasks_by_assignee_response: FindAllResponse
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