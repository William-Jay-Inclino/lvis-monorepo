import { Approver } from "../../shared/types";
import { MstData } from "./mst.types";

export const mst_data: MstData = {
    remarks: 'mst test remarks',
    returned_by: 'Estrera',
    approvers: ['Ablen']
}

export const mst_approvers: Approver[] = [
    { username: 'samantha.ablen', password: '123', popup: 'swal' },
]
