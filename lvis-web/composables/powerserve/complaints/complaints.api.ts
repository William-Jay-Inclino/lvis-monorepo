import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area } from "../common";
import type { Complaint, ComplaintReportType, ComplaintStatus, CreateComplaint, MutationResponse, NatureOfComplaint } from "./complaints.types";


export async function init_data(): Promise<{
    complaints: Complaint[],
    complaint_statuses: ComplaintStatus[],
    nature_of_complaints: NatureOfComplaint[],
    areas: Area[],
    departments: Department[],
    divisions: Division[],
    report_types: ComplaintReportType[],
}> {


    const query = `
        query {
            complaints {
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

        return {
            complaints: response.data.data.complaints,
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

export async function create(input: CreateComplaint): Promise<MutationResponse> {

    console.log('create', input);

    const account_number = input.complaint_detail.account_number?.trim() === '' ? null : `"${input.complaint_detail.account_number}"`
    const meter_number = input.complaint_detail.meter_number?.trim() === '' ? null : `"${input.complaint_detail.meter_number}"`
    const consumer_id = !input.complaint_detail.consumer ? null : `"${input.complaint_detail.consumer.id}"`
    const sitio_id = !input.complaint_detail.sitio ? null : `"${input.complaint_detail.sitio.id}"`

    let area_id = null
    let department_id = null
    let division_id = null

    if(input.assigned_to?.type === 'area') {
        area_id = `"${ input.assigned_to.id }"`
    } else if(input.assigned_to?.type === 'department') {
        department_id = `"${ input.assigned_to.id }"`
    } else if(input.assigned_to?.type === 'division') {
        division_id = `"${ input.assigned_to.id }"`
    }

    const mutation = `
        mutation {
            createComplaint(
                input: {
                    report_type_id: "${input.report_type?.id}"
                    nature_of_complaint_id: ${input.nature_of_complaint?.id}
                    complainant_name: ${input.complainant_name}
                    complainant_contact_no: ${input.complainant_contact_number}
                    description: "${input.description.replace(/\n/g, '\\n')}"
                    remarks: "${input.remarks.replace(/\n/g, '\\n')}"
                    complaint_detail: {
                        account_number: ${ account_number }
                        meter_number: ${ meter_number }
                        consumer_id: ${ consumer_id }
                        barangay_id: "${ input.complaint_detail.barangay?.id }"
                        sitio_id: ${ sitio_id }
                        landmark: "${ input.complaint_detail.landmark }"
                    }
                    assigned_to: {
                        area_id: ${ area_id }
                        department_id: ${ department_id }
                        division_id: ${ division_id }
                    }
                }
            ) {
                success
                msg 
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
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createComplaint) {
            return response.data.data.createComplaint
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Complaint. Please contact system administrator'
        };
    }
}