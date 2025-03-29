import type { CreateComplaintInput, UpdateComplaintInput } from "./complaint.types";


export const enum COMPLAINT_STATUS {
    PENDING = 1,
    IN_PROGRESS = 2,
    FOR_REVIEW = 3,
    ESCALATED = 4,
    CLOSED = 5,
    CANCELLED = 6,
}


export const enum ASSIGNED_GROUP_TYPE {
    AREA = 1,
    DEPARTMENT = 2,
    DIVISION = 3,
}


export const create_complaint_initial: CreateComplaintInput = {
    report_type: null,
    complainant_name: '',
    complainant_contact_no: '',
    description: '',
    remarks: '',
    complaint_detail: {
        consumer: null,
        municipality: null,
        barangay: null,
        sitio: null,
        landmark: '',
    },
    assigned_group: null
}


export const update_complaint_initial: UpdateComplaintInput = {
    report_type: null,
    complainant_name: '',
    complainant_contact_no: '',
    description: '',
    remarks: '',
    complaint_detail: {
        consumer: null,
        municipality: null,
        barangay: null,
        sitio: null,
        landmark: '',
    },
    assigned_group: null
}


export const _complaintDataErrorsInitial = {
    complainant_name: false,
    description: false,
    municipality: false,
    barangay: false,
    complainant_contact_no: false,
    report_type: false,
    assigned_group: false,
}