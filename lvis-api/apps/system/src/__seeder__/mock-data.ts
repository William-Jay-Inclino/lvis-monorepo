import { faker } from "@faker-js/faker";
import { Account, Classification, Department, DepartmentStatus, JOApproverSetting, MEQSApproverSetting, POApproverSetting, Position, RRApproverSetting, RVApproverSetting, SPRApproverSetting, UserEmployee, UserStatus } from "../__common__/types";
import { Role } from "apps/system/prisma/generated/client";
import { Employee, User } from "../__common__/user.entity";


export const accounts: Account[] = [
    {
        id: faker.string.uuid(),
        code: 'A1code',
        name: 'Account1',
        description: 'This is a description for account1',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        code: 'A2code',
        name: 'Account2',
        description: 'This is a description for account2',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        code: 'A3code',
        name: 'Account3',
        description: 'This is a description for account3',
        created_by: 'admin'
    },
]

export const empId1 = faker.string.uuid()

export const departments: Department[] = [
    // 0
    {
        id: faker.string.uuid(),
        code: 'IAD',
        name: 'Internal Audit Department',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
    // 1
    {
        id: faker.string.uuid(),
        code: 'ITCS',
        name: 'Information Technology / Computer Science',
        status: 1,
        created_by: 'admin'
    },
    // 2
    {
        id: faker.string.uuid(),
        code: 'HR',
        name: 'Human Resource',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
    // 3
    {
        id: faker.string.uuid(),
        code: 'Accounting',
        name: 'Accounting',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
    // 4
    {
        id: faker.string.uuid(),
        code: 'OGM',
        name: 'Office of the General Manager',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
    // 5
    {
        id: faker.string.uuid(),
        code: 'Warehouse',
        name: 'Warehouse',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
    // 6
    {
        id: faker.string.uuid(),
        code: 'Motorpool',
        name: 'Motorpool',
        status: DepartmentStatus.ACTIVE,
        created_by: 'admin'
    },
]

export const classifications: Classification[] = [
    {
        id: faker.string.uuid(),
        name: 'Classification 1',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Classification 2',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        name: 'Classification 3',
        created_by: 'admin'
    }
]

export const positions: Position[] = [
    {
        id: faker.string.uuid(), // 0
        name: 'General Manager',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 1
        name: 'IT',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 2
        name: 'Audit',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 3
        name: 'Accounting',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 4
        name: 'Warehouse',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 5
        name: 'HR',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 6
        name: 'Motorpool',
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(), // 7
        name: 'TBA',
        created_by: 'admin'
    },
]


export const employees: Employee[] = [
    // Imd. Sup. = 0
    {
        id: faker.string.uuid(),
        firstname: 'Ana Maria',
        middlename: 'Lourdes',
        lastname: 'Pastor',
        created_by: 'admin',
        position_id: positions[6].id,
        department_id: departments[3].id,
    },
    // Budget Officer = 1
    {
        id: faker.string.uuid(),
        firstname: 'Ricaflor',
        middlename: null,
        lastname: 'Suan',
        created_by: 'admin',
        position_id: positions[3].id,
        department_id: departments[3].id,
    },
    // AUDIT = 2
    {
        id: faker.string.uuid(),
        firstname: 'Marlon',
        middlename: null,
        lastname: 'Sanico',
        created_by: 'admin',
        position_id: positions[2].id,
        department_id: departments[0].id,
    },
    // GM / OIC = 3
    {
        id: faker.string.uuid(),
        firstname: 'Jannie Ann',
        middlename: null,
        lastname: 'Dayandayan',
        created_by: 'admin',
        position_id: positions[0].id,
        department_id: departments[4].id,
    },
    // 1st CPC Member = 4
    {
        id: faker.string.uuid(),
        firstname: 'Jhun Rey',
        middlename: null,
        lastname: 'Nahine',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[2].id,
    },
    // 2nd CPC Member = 5
    {
        id: faker.string.uuid(),
        firstname: 'Gretchen',
        middlename: null,
        lastname: 'Tagalog',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[3].id,
    },
    // Witness = 6
    {
        id: faker.string.uuid(),
        firstname: 'Dionic',
        middlename: null,
        lastname: 'De La Pena',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[0].id,
    },
    // CPC Chairman = 7
    {
        id: faker.string.uuid(),
        firstname: 'Anthony',
        middlename: null,
        lastname: 'Cecilio',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[4].id,
    },
    // Finance Manager = 8
    {
        id: faker.string.uuid(),
        firstname: 'Frances Paula',
        middlename: null,
        lastname: 'Lumacang',
        created_by: 'admin',
        position_id: positions[3].id,
        department_id: departments[3].id,
    },
    // 9
    {
        id: faker.string.uuid(),
        firstname: 'William Jay',
        middlename: 'Intales',
        lastname: 'Inclino',
        created_by: 'admin',
        position_id: positions[1].id,
        department_id: departments[1].id,
    },
    // 10
    {
        id: faker.string.uuid(),
        firstname: 'Joshua',
        middlename: 'X',
        lastname: 'Tayag',
        created_by: 'admin',
        position_id: positions[1].id,
        department_id: departments[1].id,
    },
    // 11
    {
        id: faker.string.uuid(),
        firstname: 'Jessa',
        middlename: 'X',
        lastname: 'Pelones',
        created_by: 'admin',
        position_id: positions[1].id,
        department_id: departments[1].id,
    },
    // 12
    {
        id: faker.string.uuid(),
        firstname: 'Joseph Ken',
        middlename: 'X',
        lastname: 'Estrera',
        created_by: 'admin',
        position_id: positions[5].id,
        department_id: departments[2].id,
    },
    // 13
    {
        id: faker.string.uuid(),
        firstname: 'Jared',
        middlename: 'X',
        lastname: 'Singcol',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[4].id,
    },
    // 14
    {
        id: faker.string.uuid(),
        firstname: 'Hannah Grace',
        middlename: 'Bioco',
        lastname: 'Tudio',
        created_by: 'admin',
        position_id: positions[2].id,
        department_id: departments[0].id,
    },
    // 15
    {
        id: faker.string.uuid(),
        firstname: 'Jessa',
        middlename: '',
        lastname: 'Valida',
        created_by: 'admin',
        position_id: positions[2].id,
        department_id: departments[0].id,
    },
    // 16
    {
        id: faker.string.uuid(),
        firstname: 'Roger',
        middlename: '',
        lastname: 'Laurente',
        position_id: positions[6].id,
        created_by: 'admin',
        department_id: departments[1].id,
    },
    // 17
    {
        id: faker.string.uuid(),
        firstname: 'Adam',
        middlename: '',
        lastname: 'Estremos',
        created_by: 'admin',
        position_id: positions[4].id,
        department_id: departments[5].id,
    },
    // 18
    {
        id: faker.string.uuid(),
        firstname: 'John',
        middlename: '',
        lastname: 'Mendoza',
        created_by: 'admin',
        position_id: positions[4].id,
        department_id: departments[5].id,
    },
    // 19
    {
        id: faker.string.uuid(),
        firstname: 'Genevieve',
        middlename: '',
        lastname: 'Salgarino',
        created_by: 'admin',
        position_id: positions[4].id,
        department_id: departments[5].id,
    },
    // 20
    {
        id: faker.string.uuid(),
        firstname: 'Monroe',
        middlename: 'Coquilla',
        lastname: 'Magdadaro',
        created_by: 'admin',
        position_id: positions[6].id,
        department_id: departments[6].id,
    }
]

export const users: User[] = [
    // 0
    {
        id: faker.string.uuid(),
        username: 'anamaria.pastor',
        password: 'anamaria.pastor123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 1
    {
        id: faker.string.uuid(),
        username: 'suan.ricaflor',
        password: 'suan.ricaflor123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 2
    {
        id: faker.string.uuid(),
        username: 'marlon.sanico',
        password: 'marlon.sanico123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 3
    {
        id: faker.string.uuid(),
        username: 'jannieann.dayandayan',
        password: 'jannieann.dayandayan123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 4
    {
        id: faker.string.uuid(),
        username: 'jhunrey.nahine',
        password: 'jhunrey.nahine123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 5
    {
        id: faker.string.uuid(),
        username: 'gretchen.tagalog',
        password: 'gretchen.tagalog123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 6
    {
        id: faker.string.uuid(),
        username: 'dionic.delapena',
        password: 'dionic.delapena123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 7
    {
        id: faker.string.uuid(),
        username: 'anthony.cecilio',
        password: 'anthony.cecilio123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 8
    {
        id: faker.string.uuid(),
        username: 'francespaula.lumacang',
        password: 'francespaula.lumacang123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 9
    {
        id: faker.string.uuid(),
        username: 'williamjay.inclino',
        password: 'williamjay.inclino123',
        status: UserStatus.ACTIVE,
        role: Role.ADMIN,
        created_by: 'admin'
    },
    // 10
    {
        id: faker.string.uuid(),
        username: 'joshua.tayag',
        password: 'joshua.tayag123',
        status: UserStatus.ACTIVE,
        role: Role.ADMIN,
        created_by: 'admin'
    },
    // 11
    {
        id: faker.string.uuid(),
        username: 'jessa.pelones',
        password: 'jessa.pelones123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 12
    {
        id: faker.string.uuid(),
        username: 'josephken.estrera',
        password: 'josephken.estrera123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 13
    {
        id: faker.string.uuid(),
        username: 'jared.singkol',
        password: 'jared.singkol123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 14
    {
        id: faker.string.uuid(),
        username: 'hannahgrace.tudio',
        password: 'hannahgrace.tudio123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 15
    {
        id: faker.string.uuid(),
        username: 'jessa.valida',
        password: 'jessa.valida123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 16
    {
        id: faker.string.uuid(),
        username: 'roger.laurente',
        password: 'roger.laurente123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 17
    {
        id: faker.string.uuid(),
        username: 'genevieve.salgarino',
        password: 'genevieve.salgarino123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    },
    // 18
    {
        id: faker.string.uuid(),
        username: 'monroe.magdadaro',
        password: 'monroe.magdadaro123',
        status: UserStatus.ACTIVE,
        role: Role.USER,
        created_by: 'admin'
    }
]

export const userEmployees: UserEmployee[] = [
    {
        id: faker.string.uuid(),
        employee_id: employees[0].id,
        user_id: users[0].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[1].id,
        user_id: users[1].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[2].id,
        user_id: users[2].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[3].id,
        user_id: users[3].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[4].id,
        user_id: users[4].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[5].id,
        user_id: users[5].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[6].id,
        user_id: users[6].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[7].id,
        user_id: users[7].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[8].id,
        user_id: users[8].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[9].id,
        user_id: users[9].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[10].id,
        user_id: users[10].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[11].id,
        user_id: users[11].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[12].id,
        user_id: users[12].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[13].id,
        user_id: users[13].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[14].id,
        user_id: users[14].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[15].id,
        user_id: users[15].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[16].id,
        user_id: users[16].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[19].id,
        user_id: users[17].id,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: employees[20].id,
        user_id: users[18].id,
        created_by: 'admin'
    }
]


export const jo_default_approvers: JOApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[1].id,
        label: 'Budget By:',
        order: 2,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[2].id,
        label: 'Pre-Audited By:',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'Approved By:',
        order: 4,
        created_by: 'admin'
    },
]

export const rv_default_approvers: RVApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[1].id,
        label: 'Budget By:',
        order: 2,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[2].id,
        label: 'Pre-Audited By:',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'Approved By:',
        order: 4,
        created_by: 'admin'
    },
]

export const spr_default_approvers: SPRApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[1].id,
        label: 'Budget By:',
        order: 2,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[2].id,
        label: 'Pre-Audited By:',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'Approved By:',
        order: 4,
        created_by: 'admin'
    },
]

export const meqs_default_approvers: MEQSApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[4].id,
        label: '1st CPC Member',
        order: 1,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[5].id,
        label: '2nd CPC Member',
        order: 2,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[6].id,
        label: 'Witness',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[7].id,
        label: 'CPC Chairman',
        order: 4,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'GM / OIC',
        order: 5,
        created_by: 'admin'
    },
]

export const po_default_approvers: POApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[1].id,
        label: 'Budget By:',
        order: 1,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[8].id,
        label: 'Finance By:',
        order: 2,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[2].id,
        label: 'Audited By:',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'Approved By:',
        order: 4,
        created_by: 'admin'
    },
]

export const rr_default_approvers: RRApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: employees[2].id,
        label: 'Audited By:',
        order: 3,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        approver_id: employees[3].id,
        label: 'Approved By:',
        order: 4,
        created_by: 'admin'
    },
]