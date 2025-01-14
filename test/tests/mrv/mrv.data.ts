import { Approver } from "../../shared/types";
import { MrvData } from "./mrv.types";

export const mrv_data: MrvData = {
    request_type: 'turn on order',
    item_from: '',
    consumer_name: 'Test Name',
    location: 'Test Location',
    purpose: 'Test Purpose',
    requested_by: 'Estrera',
    withdrawn_by: 'Ablen, Samantha',
    approvers: ['Ablen, Samantha', 'Tayag', 'Tudio', 'Dayandayan']
}

export const mrv_approvers: Approver[] = [
    { username: 'samantha.ablen', password: '123', popup: 'swal' },
    { username: 'joshua.tayag', password: '123', popup: 'swal' },
    { username: 'hannahgrace.tudio', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]
