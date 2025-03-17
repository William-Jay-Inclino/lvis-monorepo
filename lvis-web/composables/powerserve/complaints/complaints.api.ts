import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area, Municipality } from "../common";
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
            },
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
    console.log("create", input);

    // Handle complaint detail fields properly
    const account_number = input.complaint_detail.account_number?.trim() ? `"${input.complaint_detail.account_number}"` : null;
    const meter_number = input.complaint_detail.meter_number?.trim() ? `"${input.complaint_detail.meter_number}"` : null;
    const consumer_id = input.complaint_detail.consumer?.id ? `"${input.complaint_detail.consumer.id}"` : null;
    const sitio_id = input.complaint_detail.sitio?.id ? `"${input.complaint_detail.sitio.id}"` : null;
    const barangay_id = input.complaint_detail.barangay?.id ? `"${input.complaint_detail.barangay.id}"` : null;
    const landmark = input.complaint_detail.landmark ? `"${input.complaint_detail.landmark}"` : null;

    // Handle assigned_to fields
    const area_id = input.assigned_to?.type === "area" ? `"${input.assigned_to.id}"` : null;
    const department_id = input.assigned_to?.type === "department" ? `"${input.assigned_to.id}"` : null;
    const division_id = input.assigned_to?.type === "division" ? `"${input.assigned_to.id}"` : null;

    // Ensure report type and nature_of_complaint are properly formatted
    const report_type_id = input.report_type?.id ? input.report_type?.id : null;
    const nature_of_complaint_id = input.nature_of_complaint?.id ? `"${input.nature_of_complaint.id}"` : null;

    // Ensure complainant fields are properly escaped
    const complainant_name = input.complainant_name ? `"${input.complainant_name.replace(/"/g, '\\"')}"` : null;
    const complainant_contact_no = input.complainant_contact_number ? `"${input.complainant_contact_number.replace(/"/g, '\\"')}"` : null;
    const description = input.description ? `"${input.description.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;

    // GraphQL mutation string
    const mutation = `
        mutation {
            createComplaint(
                input: {
                    report_type_id: ${report_type_id}
                    nature_of_complaint_id: ${nature_of_complaint_id}
                    complainant_name: ${complainant_name}
                    complainant_contact_no: ${complainant_contact_no}
                    description: ${description}
                    remarks: ${remarks}
                    complaint_detail: {
                        account_number: ${account_number}
                        meter_number: ${meter_number}
                        consumer_id: ${consumer_id}
                        barangay_id: ${barangay_id}
                        sitio_id: ${sitio_id}
                        landmark: ${landmark}
                    }
                    assigned_to: {
                        area_id: ${area_id}
                        department_id: ${department_id}
                        division_id: ${division_id}
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
        console.log("response", response);

        if (response?.data?.data?.createComplaint) {
            return response.data.data.createComplaint;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to create Complaint. Please contact the system administrator.",
        };
    }
}
