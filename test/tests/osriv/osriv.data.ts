import { Approver } from "../../shared/types";
import { OsrivData } from "./osriv.types";

export const osriv_data: OsrivData = {
    item_from: '',
    purpose: 'Osriv test',
    requested_by: 'tayag',
    approvers: ['dayandayan']
}

export const osriv_approvers: Approver[] = [
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
    { username: 'genevieve.salgarino', password: '123', popup: 'swal' },
]