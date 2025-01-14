import { Approver } from "../../shared/types";
import { GasSlipData } from "./gas-slip.types";

export const gas_slip_data: GasSlipData = {
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    requisitioner: 'Estrera',
    driver: 'Tayag',
    gas_station: 'LEYTE V ELECTRIC COOPERATIVE',
    fuel_type: 'Unleaded',
    no_of_liters: 'fulltank',
    purpose: 'Test Purpose',
    approvers: ['Dayandayan', 'Dayandayan']
}

export const gas_slip_approvers: Approver[] = [
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]
