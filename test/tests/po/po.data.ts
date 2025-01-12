import { Approver } from "../../shared/types";
import { PoData } from "./po.types";


export const po_data: PoData = {
    meqs_number: '',
    supplier_names: []
}


export const po_approvers: Approver[] = [
    { username: 'ricaflor.suan', password: '123', popup: 'swal'},
    { username: 'francespaula.lumacang', password: '123', popup: 'modal', is_finance_manager: true },
    { username: 'marlon.sanico', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]