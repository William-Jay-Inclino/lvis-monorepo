import { faker } from "@faker-js/faker";
import { Account, Classification, Department, Division, JOApproverSetting, MEQSApproverSetting, POApproverSetting, RRApproverSetting, RVApproverSetting, SPRApproverSetting, UserEmployee, UserGroup, UserGroupMember } from "../__common__/types";
import { Role } from "apps/system/prisma/generated/client";
import { Employee, User } from "../__common__/user.entity";


export const accounts: Account[] = [
    {
        id: faker.string.uuid(),
        code: 'A1code',
        name: 'Account1',
    },
    {
        id: faker.string.uuid(),
        code: 'A2code',
        name: 'Account2',
    },
    {
        id: faker.string.uuid(),
        code: 'A3code',
        name: 'Account3',
    },
]


// =========================== DEPARTMENTS =========================== 

export const ogm_id = faker.string.uuid()
export const fsd_id = faker.string.uuid()
export const isd_id = faker.string.uuid()
export const tsd_id = faker.string.uuid()
export const cpetd_id = faker.string.uuid()
export const iad_id = faker.string.uuid()

export const departments: Department[] = [
    {
        id: ogm_id,
        code: 'OGM',
        name: 'Office of the General Manager',
    },
    {
        id: iad_id,
        code: 'IAD',
        name: 'Internal Audit Department',
    },
    {
        id: fsd_id,
        code: 'FSD',
        name: 'Finance Services Department',
    },
    {
        id: isd_id,
        code: 'ISD',
        name: 'Institutional Services Department',
    },
    {
        id: tsd_id,
        code: 'TSD',
        name: 'Technical Services Department',
    },
    {
        id: cpetd_id,
        code: 'CPETD',
        name: 'Corporate Planning And Energy Trading Department',
    },
]

// =========================== DIVISIONS =========================== 

const itcs_id = faker.string.uuid()

const meter_reading_and_billing_id = faker.string.uuid()
const collection_division_id = faker.string.uuid()
const general_accounting_division = faker.string.uuid()
const consumer_accounts_id = faker.string.uuid()
const cashiering_id = faker.string.uuid()


const membership_services_id = faker.string.uuid()
const fleet_mgmt = faker.string.uuid()
const hrd_id = faker.string.uuid()
const property_id = faker.string.uuid()
const materials_id = faker.string.uuid()


const line_services_id = faker.string.uuid()
const line_construction_id = faker.string.uuid()
const engineering_services_id = faker.string.uuid()

const power_supply = faker.string.uuid()
const strategic_planning = faker.string.uuid()

export const divisions: Division[] = [
    {
        id: itcs_id,
        department_id: ogm_id,
        code: 'ITCS',
        name: 'Information Technology and Communication Services Division',
    },
    {
        id: meter_reading_and_billing_id,
        department_id: fsd_id,
        code: 'MRBD',
        name: 'Meter Reading and Billing Division',
    },
    {
        id: collection_division_id,
        department_id: fsd_id,
        code: 'Collection',
        name: 'Collection Division',
    },
    {
        id: general_accounting_division,
        department_id: fsd_id,
        code: 'Accounting',
        name: 'General Accounting Division',
    },
    {
        id: consumer_accounts_id,
        department_id: fsd_id,
        code: 'Consumer Accounts',
        name: 'Consumer Accounts Section',
    },
    {
        id: cashiering_id,
        department_id: fsd_id,
        code: 'CRDS',
        name: 'Cashiering, Receipts, & Disbursements Section',
    },
    {
        id: membership_services_id,
        department_id: isd_id,
        code: 'Membership',
        name: 'Membership Services Division',
    },
    {
        id: fleet_mgmt,
        department_id: isd_id,
        code: 'Fleet',
        name: 'Fleet Management Services',
    },
    {
        id: hrd_id,
        department_id: isd_id,
        code: 'HRD',
        name: 'Human Resource Division',
    },
    {
        id: property_id,
        department_id: isd_id,
        code: 'PDMS',
        name: 'Property Development & Maintenance Section',
    },
    {
        id: materials_id,
        department_id: isd_id,
        code: 'Materials',
        name: 'Materials Management Section',
    },
    {
        id: line_services_id,
        department_id: tsd_id,
        code: 'Line Services',
        name: 'Line Services Division',
    },
    {
        id: line_construction_id,
        department_id: tsd_id,
        code: 'Line Construction',
        name: 'Line Construction Division',
    },
    {
        id: engineering_services_id,
        department_id: tsd_id,
        code: 'Engineering Services',
        name: 'Engineering Services Division',
    },
    {
        id: power_supply,
        department_id: cpetd_id,
        code: 'PSETS',
        name: 'Power Supply and Energy Trading Section',
    },
    {
        id: strategic_planning,
        department_id: cpetd_id,
        code: 'SPRCS',
        name: 'Strategic Planning & Regulatory Compliance Section',
    },
]

export const classifications: Classification[] = [
    {
        id: faker.string.uuid(),
        name: 'Classification 1',
    },
    {
        id: faker.string.uuid(),
        name: 'Classification 2',
    },
    {
        id: faker.string.uuid(),
        name: 'Classification 3',
    }
]


// =========================== EMPLOYEES =========================== 

const analou = faker.string.uuid()
const ricaflor = faker.string.uuid()
const marlon = faker.string.uuid()
export const jannie = faker.string.uuid()
const jhunrey = faker.string.uuid()
const gretchen = faker.string.uuid()
const dionic = faker.string.uuid()
const anthony = faker.string.uuid()
const paula = faker.string.uuid()
const joshua = faker.string.uuid()
const jessa_pelones = faker.string.uuid()
const joseph_ken = faker.string.uuid()
const hannah_grace = faker.string.uuid()
const jessa_valida = faker.string.uuid()
const adam = faker.string.uuid()
const sam = faker.string.uuid()
export const gene = faker.string.uuid()
export const monroe = faker.string.uuid()
const ricardo = faker.string.uuid()
const michael = faker.string.uuid()

export const employees: Employee[] = [
    {
        id: analou,
        firstname: 'Ana Maria Lourdes',
        middlename: 'M',
        lastname: 'Pastor',
        department_id: isd_id,
        employee_number: '1',
        rank_number: 16,
        created_by: 'admin',
    },
    {
        id: ricaflor,
        firstname: 'Ricaflor',
        middlename: 'S',
        lastname: 'Suan',
        created_by: 'admin',
        department_id: fsd_id,
        employee_number: '2',
        rank_number: 10,
    },
    {
        id: marlon,
        firstname: 'Marlon',
        middlename: 'H',
        lastname: 'Sanico',
        created_by: 'admin',
        department_id: iad_id,
        employee_number: '3',
        rank_number: 16,
    },
    {
        id: jannie,
        firstname: 'Jannie Ann',
        middlename: 'J',
        lastname: 'Dayandayan',
        created_by: 'admin',
        department_id: ogm_id,
        employee_number: '4',
        rank_number: 20,
    },
    {
        id: jhunrey,
        firstname: 'Jhun Rey',
        middlename: 'B',
        lastname: 'Nahine',
        created_by: 'admin',
        department_id: ogm_id,
        employee_number: '5',
        rank_number: 8,
    },
    {
        id: gretchen,
        firstname: 'Gretchen',
        middlename: 'D',
        lastname: 'Tagalog',
        created_by: 'admin',
        department_id: fsd_id,
        division_id: general_accounting_division,
        employee_number: '6',
        rank_number: 15,
    },
    {
        id: dionic,
        firstname: 'Dionic',
        middlename: 'L',
        lastname: 'De La Peña',
        created_by: 'admin',
        department_id: iad_id,
        employee_number: '7',
        rank_number: 12,
    },
    {
        id: anthony,
        firstname: 'Anthony',
        middlename: 'S',
        lastname: 'Cecilio',
        created_by: 'admin',
        department_id: tsd_id,
        division_id: line_services_id,
        employee_number: '8',
        rank_number: 11,
    },
    {
        id: paula,
        firstname: 'Frances Paula',
        middlename: 'M',
        lastname: 'Lumacang',
        created_by: 'admin',
        department_id: fsd_id,
        employee_number: '9',
        rank_number: 18,
    },
    {
        id: joshua,
        firstname: 'Joshua',
        middlename: 'J',
        lastname: 'Tayag',
        created_by: 'admin',
        department_id: ogm_id,
        division_id: itcs_id,
        employee_number: '10',
        rank_number: 12,
    },
    {
        id: jessa_pelones,
        firstname: 'Jessa',
        lastname: 'Pelones',
        created_by: 'admin',
        department_id: ogm_id,
        division_id: itcs_id,
        employee_number: '11',
        rank_number: 4,
    },
    {
        id: joseph_ken,
        firstname: 'Joseph Ken',
        middlename: 'X',
        lastname: 'Estrera',
        created_by: 'admin',
        department_id: fsd_id,
        division_id: meter_reading_and_billing_id,
        employee_number: '12',
        rank_number: 2,
    },
    {
        id: hannah_grace,
        firstname: 'Hannah Grace',
        middlename: 'Bioco',
        lastname: 'Tudio',
        created_by: 'admin',
        department_id: iad_id,
        employee_number: '13',
        rank_number: 6,
    },
    {
        id: jessa_valida,
        firstname: 'Jessa',
        middlename: '',
        lastname: 'Valida',
        created_by: 'admin',
        department_id: fsd_id,
        division_id: general_accounting_division,
        employee_number: '14',
        rank_number: 6,
    },
    {
        id: adam,
        firstname: 'Adam',
        middlename: 'C',
        lastname: 'Estremos',
        created_by: 'admin',
        department_id: isd_id,
        employee_number: '15',
        rank_number: 10,
    },
    {
        id: sam,
        firstname: 'Samantha',
        middlename: 'O',
        lastname: 'Ablen',
        created_by: 'admin',
        department_id: isd_id,
        division_id: materials_id,
        employee_number: '16',
        rank_number: 6,
    },
    {
        id: gene,
        firstname: 'Genevieve',
        middlename: 'J',
        lastname: 'Salgarino',
        created_by: 'admin',
        department_id: isd_id,
        division_id: materials_id,
        employee_number: '17',
        rank_number: 14,
    },
    {
        id: monroe,
        firstname: 'Monroe',
        middlename: 'Coquilla',
        lastname: 'Magdadaro',
        created_by: 'admin',
        department_id: isd_id,
        division_id: fleet_mgmt,
        employee_number: '18',
        rank_number: 14,
    },
    {
        id: ricardo,
        firstname: 'Ricardo',
        middlename: 'R',
        lastname: 'Lequin',
        created_by: 'admin',
        department_id: tsd_id,
        employee_number: '19',
        rank_number: 19,
    },
    {
        id: michael,
        firstname: 'Michael',
        middlename: 'R',
        lastname: 'Guiñarez',
        created_by: 'admin',
        department_id: cpetd_id,
        employee_number: '20',
        rank_number: 19,
    },
]


// =========================== USERS =========================== 

const u_analou = faker.string.uuid()
const u_ricaflor = faker.string.uuid()
const u_marlon = faker.string.uuid()
const u_jannie = faker.string.uuid()
const u_jhunrey = faker.string.uuid()
const u_gretchen = faker.string.uuid()
const u_dionic = faker.string.uuid()
const u_anthony = faker.string.uuid()
const u_paula = faker.string.uuid()
const u_joshua = faker.string.uuid()
const u_jessa_pelones = faker.string.uuid()
const u_joseph_ken = faker.string.uuid()
const u_hannah_grace = faker.string.uuid()
const u_jessa_valida = faker.string.uuid()
const u_adam = faker.string.uuid()
const u_sam = faker.string.uuid()
const u_gene = faker.string.uuid()
const u_monroe = faker.string.uuid()
const u_ricardo = faker.string.uuid()
const u_michael = faker.string.uuid()

export const users: User[] = [
    {
        id: u_analou,
        username: 'anamarialourdes.pastor',
        password: 'anamarialourdes.pastor',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_ricaflor,
        username: 'ricaflor.suan',
        password: 'ricaflor.suan',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_marlon,
        username: 'marlon.sanico',
        password: 'marlon.sanico',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_jannie,
        username: 'jannieann.dayandayan',
        password: 'jannieann.dayandayan',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_jhunrey,
        username: 'jhunrey.nahine',
        password: 'jhunrey.nahine',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_gretchen,
        username: 'gretchen.tagalog',
        password: 'gretchen.tagalog',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_dionic,
        username: 'dionic.delapena',
        password: 'dionic.delapena',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_anthony,
        username: 'anthony.cecilio',
        password: 'anthony.cecilio',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_paula,
        username: 'francespaula.lumacang',
        password: 'francespaula.lumacang',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_joshua,
        username: 'joshua.tayag',
        password: 'joshua.tayag',
        role: Role.ADMIN,
        created_by: 'admin'
    },
    {
        id: u_jessa_pelones,
        username: 'jessa.pelones',
        password: 'jessa.pelones',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_joseph_ken,
        username: 'josephken.estrera',
        password: 'josephken.estrera',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_hannah_grace,
        username: 'hannahgrace.tudio',
        password: 'hannahgrace.tudio',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_jessa_valida,
        username: 'jessa.valida',
        password: 'jessa.valida',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_adam,
        username: 'adam.estremos',
        password: 'adam.estremos',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_sam,
        username: 'samantha.ablen',
        password: 'samantha.ablen',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_gene,
        username: 'genevieve.salgarino',
        password: 'genevieve.salgarino',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_monroe,
        username: 'monroe.magdadaro',
        password: 'monroe.magdadaro',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_ricardo,
        username: 'ricardo.lequin',
        password: 'ricardo.lequin',
        role: Role.USER,
        created_by: 'admin'
    },
    {
        id: u_michael,
        username: 'michael.guinarez',
        password: 'michael.guinarez',
        role: Role.USER,
        created_by: 'admin'
    }
]

export const userEmployees: UserEmployee[] = [
    {
        id: faker.string.uuid(),
        employee_id: analou,
        user_id: u_analou,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: ricaflor,
        user_id: u_ricaflor,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: marlon,
        user_id: u_marlon,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: jannie,
        user_id: u_jannie,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: jhunrey,
        user_id: u_jhunrey,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: gretchen,
        user_id: u_gretchen,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: dionic,
        user_id: u_dionic,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: anthony,
        user_id: u_anthony,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: paula,
        user_id: u_paula,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: joshua,
        user_id: u_joshua,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: jessa_pelones,
        user_id: u_jessa_pelones,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: joseph_ken,
        user_id: u_joseph_ken,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: hannah_grace,
        user_id: u_hannah_grace,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: jessa_valida,
        user_id: u_jessa_valida,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: adam,
        user_id: u_adam,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: sam,
        user_id: u_sam,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: gene,
        user_id: u_gene,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: monroe,
        user_id: u_monroe,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: ricardo,
        user_id: u_ricardo,
        created_by: 'admin'
    },
    {
        id: faker.string.uuid(),
        employee_id: michael,
        user_id: u_michael,
        created_by: 'admin'
    },
]

export const userGroups : UserGroup[] = [
    {
        id: 1,
        name: 'Department Head',
    },
    {
        id: 2,
        name: 'Finance Manager',
    },
    {
        id: 3,
        name: 'Budget Officer',
    },
    {
        id: 4,
        name: 'Auditor',
    },
    {
        id: 5,
        name: 'Driver',
    }
]

export const userGroupMember: UserGroupMember[] = [
    {
        user_id: u_jannie,
        user_group_id: 1,
    },
    {
        user_id: u_paula,
        user_group_id: 1,
    },
    {
        user_id: u_analou,
        user_group_id: 1,
    },
    {
        user_id: u_ricardo,
        user_group_id: 1,
    },
    {
        user_id: u_michael,
        user_group_id: 1,
    },
    {
        user_id: u_marlon,
        user_group_id: 1,
    },
    {
        user_id: u_paula,
        user_group_id: 2,
    },
    {
        user_id: u_ricaflor,
        user_group_id: 3,
    },
    {
        user_id: u_hannah_grace,
        user_group_id: 4,
    },
    {
        user_id: u_marlon,
        user_group_id: 4,
    },
    {
        user_id: u_dionic,
        user_group_id: 4,
    }
]

export const jo_default_approvers: JOApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: ricaflor,
        label: 'Budget By',
        order: 2,
    },
    {
        id: faker.string.uuid(),
        approver_id: marlon,
        label: 'Pre-Audited By',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'Approved By',
        order: 4,
    },
]

export const rv_default_approvers: RVApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: ricaflor,
        label: 'Budget By',
        order: 2,
    },
    {
        id: faker.string.uuid(),
        approver_id: marlon,
        label: 'Pre-Audited By',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'Approved By',
        order: 4,
    },
]

export const spr_default_approvers: SPRApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: ricaflor,
        label: 'Budget By',
        order: 2,
    },
    {
        id: faker.string.uuid(),
        approver_id: marlon,
        label: 'Pre-Audited By',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'Approved By',
        order: 4,
    },
]

export const meqs_default_approvers: MEQSApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: jhunrey,
        label: '1st CPC Member',
        order: 1,
    },
    {
        id: faker.string.uuid(),
        approver_id: gretchen,
        label: '2nd CPC Member',
        order: 2,
    },
    {
        id: faker.string.uuid(),
        approver_id: dionic,
        label: 'Witness',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: anthony,
        label: 'CPC Chairman',
        order: 4,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'GM / OIC',
        order: 5,
    },
]

export const po_default_approvers: POApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: ricaflor,
        label: 'Budget By',
        order: 1,
    },
    {
        id: faker.string.uuid(),
        approver_id: paula,
        label: 'Finance By',
        order: 2,
    },
    {
        id: faker.string.uuid(),
        approver_id: marlon,
        label: 'Audited By',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'Approved By',
        order: 4,
    },
]

export const rr_default_approvers: RRApproverSetting[] = [
    {
        id: faker.string.uuid(),
        approver_id: marlon,
        label: 'Audited By',
        order: 3,
    },
    {
        id: faker.string.uuid(),
        approver_id: jannie,
        label: 'Approved By',
        order: 4,
    },
]