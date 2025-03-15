import type { ComplaintStatus, FindAllComplaintsResponse } from "./complaints.types";


export async function init_data(payload: { 
    complaint: {
        page: number, 
        pageSize: number, 
        created_at: string | null
    } 
}): Promise<{
    complaints_response: FindAllComplaintsResponse,
    complaint_statuses: ComplaintStatus[]
}> {

    const { complaint } = payload
    const { page, pageSize, created_at } = complaint

    let _created_at = created_at ? `"${created_at}"` : null

    const query = `
        query {
            complaints(
                page: ${page},
                pageSize: ${pageSize},
                date: ${_created_at},
            ) {
                data {
                    id
                    ref_number
                    complainant_name
                    complainant_contact_no
                    description
                    remarks
                    created_at
                    complaint_detail {
                        id 
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
                    report_type {
                        id 
                        name 
                    }
                    nature_of_complaint {
                        id 
                        name
                    }
                    status {
                        id 
                        name 
                        color_class
                    }
                    assigned_to {
                        id 
                        area {
                            id 
                            name
                        }
                        department {
                            id 
                            name 
                        }
                        division {
                            id 
                            name 
                        }
                    }
                }
                totalItems
                currentPage
                totalPages
            },
            complaint_statuses {
                id 
                name
                color_class
                total
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        const complaints_response = response.data.data.complaints

        return {
            complaints_response,
            complaint_statuses: response.data.data.complaint_statuses
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}