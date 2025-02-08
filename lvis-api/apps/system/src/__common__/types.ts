
export interface Division {
    id: string
    department_id: string
    code: string
    name: string
}

export interface Department {
    id: string
    code: string
    name: string
}

export interface Account {
    id: string
    code: string
    name: string
}

export interface Service {
    id: string
    name: string
    created_by: string
}

export interface Classification {
    id: string
    name: string
}


export interface UserEmployee {
    id: string
    user_id: string
    employee_id: string
    created_by: string
}

export interface JOApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface RVApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface SPRApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface MEQSApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface POApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface RRApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
}

export interface UserGroupMember {
    user_id: string 
    user_group_id: number 
}

export interface UserGroup {
    id: number
    name: string 
}

export enum DATABASE {
    SYSTEM = 'lvis_system_db',
    WAREHOUSE = 'lvis_warehouse_db',
}

export enum DB_TABLE {
    NONE = 'N/A',

    EMPLOYEE = 'employee',
    DEPARTMENT = 'department',
    DIVISION = 'division',
    ACCOUNT = 'account',
    CLASSIFICATION = 'classification',
    USER = 'user',
}