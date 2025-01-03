import { Page } from "@playwright/test"

export interface Approver {
    username: string
    password: string
    popup: 'swal' | 'modal'
    is_budget_officer?: boolean
    is_finance_manager?: boolean
}


export interface ToastPayload {
    page: Page;
    containerSelector?: string; 
    delay?: number; 
}