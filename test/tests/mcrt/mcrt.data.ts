import { Approver } from "../../shared/types";
import { McrtData } from "./mcrt.types";

export const mcrt_data: McrtData = {
    mct_number: '',
    note: 'mcrt test note',
    returned_by: 'Estrera',
    approvers: ['Ablen', 'Tayag', 'Salgarino', 'Tudio']
}

export const mcrt_approvers: Approver[] = [
    { username: 'samantha.ablen', password: '123', popup: 'swal' },
    { username: 'joshua.tayag', password: '123', popup: 'swal' },
    { username: 'genevieve.salgarino', password: '123', popup: 'swal' },
    { username: 'hannahgrace.tudio', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]
