import type { Task, TaskStatus } from "./tasks.types";

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
                ref_number
                remarks
                accomplishment
                action_taken
                created_at
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
                    nature_of_complaint {
                        id 
                        name
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