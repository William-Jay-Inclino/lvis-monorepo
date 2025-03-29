import type { Department } from "~/composables/hr/department/department";
import type { Division } from "~/composables/hr/division/division";
import type { Municipality } from "../common";
import type { Complaint, ComplaintReportType, ComplaintStatus, CreateComplaintInput, FindAllResponse, MutationResponse, UpdateComplaintInput, UpdateComplaintStatusInput } from "./complaint.types";
import { sendRequest } from "~/utils/api"
import type { Area } from "../area/area.types";
import { ASSIGNED_GROUP_TYPE } from "./complaint.constants";

export async function complaint_index_init(): Promise<{
    complaint_statuses: ComplaintStatus[]
}> {

    const query = `
        query {
            complaint_statuses {
                id 
                name
                color_class
                description
                total
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            complaint_statuses: response.data.data.complaint_statuses
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

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
                    created_at
                    assigned_group {
                        id 
                        name
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
        return response.data.data.complaints;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(payload: { id?: number, ref_number?: string }): Promise<Complaint | undefined> {

    const { id, ref_number } = payload

    console.log('payload', payload);

    if(!id && !ref_number) {
        console.error('Please provide id or ref_number');
        return
    }

    const args = id ? `id: ${ id }` : `ref_number: "${ ref_number }"`

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
                created_by
                assigned_group_type
                assigned_group_id
                assigned_group {
                    id 
                    name
                }
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
                    description
                    remarks
                    accomplishment 
                    action_taken 
                    created_at 
                    assignee {
                        id 
                        firstname
                        middlename
                        lastname
                        name_prefix
                        name_suffix
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
                    task_detail_power_interruption {
                        linemen_incharge {
                            id
                            lineman {
                                employee {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                        affected_area
                        feeder {
                            id 
                            name
                        }
                        cause 
                        weather_condition {
                            id 
                            name
                        }
                        device {
                            id 
                            name
                        }
                        equipment_failed
                        fuse_rating
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

export async function fetchFormDataInUpdate(payload: { complaint_id: number }): Promise<{
    complaint: Complaint | undefined,
    report_types: ComplaintReportType[],
    municipalities: Municipality[],
    departments: Department[],
    divisions: Division[],
    areas: Area[],
}> {

    const { complaint_id } = payload

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
            complaint(id: ${ complaint_id }) {
                id 
                ref_number
                complainant_name
                complainant_contact_no
                description
                remarks
                created_at
                created_by
                assigned_group_type
                assigned_group_id
                assigned_group {
                    id 
                    name
                }
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
                tasks {
                    id 
                    task_status_id
                }
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
        let complaint = undefined

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.complaint) {
            complaint = data.complaint
        }

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
            complaint,
            report_types,
            municipalities,
            departments,
            divisions,
            areas,
        }

    } catch (error) {
        console.error(error);
        return {
            complaint: undefined,
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
    const consumer_id = input.complaint_detail.consumer?.id ? `"${input.complaint_detail.consumer.id}"` : null;
    const sitio_id = input.complaint_detail.sitio?.id ? `"${input.complaint_detail.sitio.id}"` : null;
    const barangay_id = input.complaint_detail.barangay?.id ? `"${input.complaint_detail.barangay.id}"` : null;
    const landmark = input.complaint_detail.landmark ? `"${input.complaint_detail.landmark}"` : null;

    // Handle assigned_to fields
    const area_id = input.assigned_group?.type ===  ASSIGNED_GROUP_TYPE.AREA ? `"${input.assigned_group.id}"` : null;
    const department_id = input.assigned_group?.type === ASSIGNED_GROUP_TYPE.DEPARTMENT ? `"${input.assigned_group.id}"` : null;
    const division_id = input.assigned_group?.type === ASSIGNED_GROUP_TYPE.DIVISION ? `"${input.assigned_group.id}"` : null;

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
            create_complaint(
                input: {
                    report_type_id: ${report_type_id}
                    complainant_name: ${complainant_name}
                    complainant_contact_no: ${complainant_contact_no}
                    description: ${description}
                    remarks: ${remarks}
                    complaint_detail: {
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

        if (response?.data?.data?.create_complaint) {
            return response.data.data.create_complaint;
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

export async function update(payload: { input: UpdateComplaintInput, complaint_id: number }): Promise<MutationResponse> {
    console.log("update", payload);

    const { input, complaint_id } = payload

    // Handle complaint detail fields properly
    const consumer_id = input.complaint_detail.consumer?.id ? `"${input.complaint_detail.consumer.id}"` : null;
    const sitio_id = input.complaint_detail.sitio?.id ? `"${input.complaint_detail.sitio.id}"` : null;
    const barangay_id = input.complaint_detail.barangay?.id ? `"${input.complaint_detail.barangay.id}"` : null;
    const landmark = input.complaint_detail.landmark ? `"${input.complaint_detail.landmark}"` : null;

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
            update_complaint(
                input: {
                    complaint_id: ${ complaint_id },
                    report_type_id: ${report_type_id}
                    complainant_name: ${complainant_name}
                    complainant_contact_no: ${complainant_contact_no}
                    description: ${description}
                    remarks: ${remarks}
                    complaint_detail: {
                        consumer_id: ${consumer_id}
                        barangay_id: ${barangay_id}
                        sitio_id: ${sitio_id}
                        landmark: ${landmark}
                    }
                    assigned_group_type: ${ input.assigned_group?.type }
                    assigned_group_id: "${ input.assigned_group?.id }"
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

        if (response?.data?.data?.update_complaint) {
            return response.data.data.update_complaint;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update Complaint. Please contact the system administrator.",
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

export async function update_complaint_status(input: UpdateComplaintStatusInput): Promise<MutationResponse> {

    const remarks = input.remarks ? `"${input.remarks.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : null;
    
    const mutation = `
        mutation {
            update_complaint_status(
                input: {
                    complaint_status_id: ${ input.status_id }
                    complaint_id: ${ input.complaint.id }
                    remarks: ${ remarks },
                }
            ) {
                success
                msg
                data {
                    id
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.update_complaint_status) {
            return response.data.data.update_complaint_status;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update complaint status. Please contact the system administrator.",
        };
    }
}