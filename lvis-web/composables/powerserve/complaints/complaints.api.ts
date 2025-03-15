import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area } from "../common";
import type { ComplaintReportType, ComplaintStatus, FindAllComplaintsResponse, NatureOfComplaint } from "./complaints.types";


export async function init_data(payload: { 
    complaint: {
        page: number, 
        pageSize: number, 
        created_at: string | null
    } 
}): Promise<{
    complaints_response: FindAllComplaintsResponse,
    complaint_statuses: ComplaintStatus[],
    nature_of_complaints: NatureOfComplaint[],
    areas: Area[],
    departments: Department[],
    divisions: Division[],
    report_types: ComplaintReportType[],
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
                description
            },
            nature_of_complaints {
                id
                name
            },
            areas {
                id
                name
                total_municipalities
                total_barangays
                total_sitios
                oic {
                    id
                    firstname
                    middlename
                    lastname
                }
                municipalities {
                    id 
                    name
                    barangays {
                        id 
                        name
                    }
                }
            },
            departments {
                id
                name
            },
            divisions {
                id 
                name
            },
            complaint_report_types {
                id 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        const complaints_response = response.data.data.complaints

        return {
            complaints_response,
            complaint_statuses: response.data.data.complaint_statuses,
            nature_of_complaints: response.data.data.nature_of_complaints,
            areas: response.data.data.areas,
            departments: response.data.data.departments,
            divisions: response.data.data.divisions,
            report_types: response.data.data.complaint_report_types,
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}