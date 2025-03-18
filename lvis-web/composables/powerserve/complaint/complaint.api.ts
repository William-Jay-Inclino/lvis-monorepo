import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Area, Municipality } from "../common";
import type { Complaint, ComplaintReportType, CreateComplaintInput, FindAllResponse, MutationResponse } from "./complaint.types";
import { sendRequest } from "~/utils/api"

export async function findAll(payload: { page: number, pageSize: number, created_at: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, created_at } = payload;

    let created_at2 = null

    if (created_at) {
        created_at2 = `"${created_at}"`
    }

    const query = `
        query {
            complaints(
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
                    complainant_name
                    complainant_contact_no
                    description
                    remarks
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
        return response.data.data.complaints;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Complaint | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `ref_number: "${id}"`
    } else {
        args = `id: ${id}`
    }

    const query = `
        query {
            complaint(${args}) {
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

        if (response.data && response.data.data && response.data.data.complaint) {
            return response.data.data.complaint;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    complaints: Complaint[],
}> {
    const query = `
        query {
            complaints(page: 1, pageSize: 10) {
                data{
                    ref_number
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let complaints = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.complaints && data.complaints.data) {
            complaints = data.complaints.data
        }
        return {
            complaints,
        }

    } catch (error) {
        console.error(error);
        return {
            complaints: [],
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    report_types: ComplaintReportType[],
    municipalities: Municipality[],
    departments: Department[],
    divisions: Division[],
    areas: Area[],
}> {


    const query = `
        query {
            complaint_report_types{
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

        if (data.complaint_report_types) {
            report_types = data.complaint_report_types
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
            report_types,
            municipalities,
            departments,
            divisions,
            areas,
        }

    } catch (error) {
        console.error(error);
        return {
            report_types: [],
            municipalities: [],
            departments: [],
            divisions: [],
            areas: [],
        }
    }


}

export async function create(input: CreateComplaintInput): Promise<MutationResponse> {
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

    // Ensure complainant fields are properly escaped
    const complainant_name = input.complainant_name ? `"${input.complainant_name.replace(/"/g, '\\"')}"` : null;
    const complainant_contact_no = input.complainant_contact_no ? `"${input.complainant_contact_no.replace(/"/g, '\\"')}"` : null;
    const description = input.description ? `"${input.description.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;

    // GraphQL mutation string
    const mutation = `
        mutation {
            createComplaint(
                input: {
                    report_type_id: ${report_type_id}
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
                    area_id: ${area_id}
                    department_id: ${department_id}
                    division_id: ${division_id}
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

export async function findByRefNumber(refNumber: string): Promise<Complaint | undefined> {
    const query = `
        query {
            complaint(ref_number: "${refNumber}") {
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

        if (response.data && response.data.data && response.data.data.complaint) {
            return response.data.data.complaint;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchRefNumbers(payload: string): Promise<Complaint[]> {
    const query = `
        query {
            complaints_by_ref_number(ref_number: "${payload}") {
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
        return response.data.data.complaints_by_ref_number

    } catch (error) {
        console.error(error);
        return []
    }
}