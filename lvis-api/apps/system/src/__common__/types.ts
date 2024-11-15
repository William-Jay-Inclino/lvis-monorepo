
export const enum UserStatus {
    ACTIVE = 1,
    INACTIVE = 2
}

export const enum DepartmentStatus {
    ACTIVE = 1,
    INACTIVE = 2
}

export const enum DivisionStatus {
    ACTIVE = 1,
    INACTIVE = 2
}

export interface Division {
    id: string
    department_id: string
    code: string
    name: string
    created_by: string
}

export interface Department {
    id: string
    code: string
    name: string
    status: number
    created_by: string
}

export interface Account {
    id: string
    code: string
    name: string
    description: string
    created_by: string
}

export interface Service {
    id: string
    name: string
    created_by: string
}

export interface Classification {
    id: string
    name: string
    created_by: string
}

export interface Position {
    id: string
    name: string
    created_by: string
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
    created_by: string
}

export interface RVApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
    created_by: string
}

export interface SPRApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
    created_by: string
}

export interface MEQSApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
    created_by: string
}

export interface POApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
    created_by: string
}

export interface RRApproverSetting {
    id: string
    approver_id: string
    label: string
    order: number
    created_by: string
}

export interface UserGroupMember {
    user_id: string 
    user_group_id: number 
}

export interface UserGroup {
    id: number
    name: string 
}

// export enum MODULES {


//     // ========= DATA MANAGEMENT ========= 
//     ACCOUNT = 'ACCOUNT',
//     CLASSIFICATION = 'CLASSIFICATION',
//     DEPARTMENT = 'DEPARTMENT',
//     EMPLOYEE = 'EMPLOYEE',

// }


// export enum RESOLVERS {

//     // ========= ACCOUNT ========= 
//     createAccount = 'createAccount',
//     accounts = 'accounts',
//     account = 'account',
//     updateAccount = 'updateAccount',
//     removeAccount = 'removeAccount',


//     // ========= CLASSIFICATION ========= 
//     createClassification = 'createClassification',
//     classifications = 'classifications',
//     classification = 'classification',
//     updateClassification = 'updateClassification',
//     removeClassification = 'removeClassification',


//     // ========= DEPARTMENT ========= 
//     createDepartment = 'createDepartment',
//     departments = 'departments',
//     department = 'department',
//     updateDepartment = 'updateDepartment',
//     removeDepartment = 'removeDepartment',


//     // ========= EMPLOYEE ========= 
//     createEmployee = 'createEmployee',
//     employees = 'employees',
//     employeesByName = 'employeesByName',
//     employee = 'employee',
//     updateEmployee = 'updateEmployee',
//     removeEmployee = 'removeEmployee',

// }