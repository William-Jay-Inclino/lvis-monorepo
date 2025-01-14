import { Approver } from "../../shared/types";
import { RrData } from "./rr.types";


export const rr_data: RrData = {
    po_number: '',
    invoice: '',
    received_by: 'Ablen, Samantha'
}


export const rr_approvers: Approver[] = [
    { username: 'samantha.ablen', password: '123', popup: 'swal' },
    { username: 'joshua.tayag', password: '123', popup: 'swal' },
    { username: 'marlon.sanico', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]