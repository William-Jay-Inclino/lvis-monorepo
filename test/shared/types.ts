
export interface Approver {
    username: string
    password: string
    popup: 'swal' | 'modal'
    is_budget_officer?: boolean
    is_finance_manager?: boolean
}