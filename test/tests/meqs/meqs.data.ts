import { Approver } from "../../shared/types";
import { MeqsData } from "./meqs.types";


export const meqs_data: MeqsData = {
    rv_number: '',
    suppliers: [
        {
            supplier_name: '',
            payment_terms: 'Bank',
            items: [
                { price: 100, is_awarded: true },
                { price: 3000, is_awarded: false },
            ]
        },
        {
            supplier_name: '',
            payment_terms: 'COD',
            items: [
                { price: 200, is_awarded: false },
                { price: 2000, is_awarded: true },
            ]
        },
        {
            supplier_name: '',
            payment_terms: '30 days',
            items: [
                { price: 300, is_awarded: false },
                { price: 1000, is_awarded: false },
            ]
        }
    ]
}


export const meqs_approvers: Approver[] = [
    { username: 'jhunrey.nahine', password: '123', popup: 'swal' },
    { username: 'gretchen.tagalog', password: '123', popup: 'swal' },
    { username: 'dionic.delapena', password: '123', popup: 'swal' },
    { username: 'anthony.cecilio', password: '123', popup: 'swal' },
    { username: 'jannieann.dayandayan', password: '123', popup: 'swal' },
]