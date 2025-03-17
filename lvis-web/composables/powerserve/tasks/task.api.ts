import type { AssignTaskInput, MutationResponse, Task, TaskStatus } from "./tasks.types";

export async function init_data(payload: {
    assignee_id: string
}): Promise<{
    tasks_by_assignee: Task[],
    task_statuses: TaskStatus[],
    pending_tasks: Task[],
}> {

    const { assignee_id } = payload

    const query = `
        query {
            tasks_by_assignee (assignee_id: "${ assignee_id }") {
                id
                ref_number
                remarks
                accomplishment
                action_taken
                created_at
                status {
                    id 
                    name
                    color_class
                }
                complaint {
                    id
                    complainant_name
                    complainant_contact_no
                    nature_of_complaint {
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
                        barangay{
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
                }
            }
            task_statuses {
                id 
                name
                color_class
                total
                description
            }
            pending_tasks {
                id
                ref_number
                created_at
                complaint {
                    id 
                    description
                    remarks
                    complainant_name
                    complainant_contact_no
                    nature_of_complaint {
                        id 
                        name
                    }
                    complaint_detail {
                        id 
                        consumer {
                            id 
                            name
                        }
                        account_number
                        meter_number
                        landmark
                        barangay{
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
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        return {
            tasks_by_assignee: response.data.data.tasks_by_assignee,
            task_statuses: response.data.data.task_statuses,
            pending_tasks: response.data.data.pending_tasks,
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function asign_task(input: AssignTaskInput): Promise<MutationResponse> {
    console.log("asign_task", input);

    const task_id = input.task.id
    const assigned_to_id = `"${ input.assign_to.id }"`
    const remarks = `"${ input.remarks }"`
    const will_start = input.will_start

    const mutation = `
        mutation {
            assign_task(
                input: {
                    task_id: ${ task_id },
                    assigned_to_id: ${ assigned_to_id },
                    remarks: ${ remarks },
                    will_start: ${ will_start },
                }
            ) {
                success
                msg
                data {
                    id
                    ref_number
                    remarks
                    accomplishment
                    action_taken
                    created_at
                    status {
                        id 
                        name
                        color_class
                    }
                    complaint {
                        id
                        complainant_name
                        complainant_contact_no
                        nature_of_complaint {
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
                            barangay{
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
                    }
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
            msg: "Failed to assign Task. Please contact the system administrator.",
        };
    }
}