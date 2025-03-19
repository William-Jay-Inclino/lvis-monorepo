import type { FindAllResponse, Task } from "./task.types";


export async function init_data(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
}): Promise<{ 
    pending_tasks: Task[],
    tasks_by_assignee_response: FindAllResponse
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
            tasks_by_assignee_response: response.data.data.tasks
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}