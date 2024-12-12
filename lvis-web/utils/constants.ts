import { DEPARTMENT_STATUS, type WarehouseRequestType } from "~/composables/common.types"
import { EMPLOYEE_STATUS } from "~/composables/system/employee/employee.types"


export enum SERVICES {
    WAREHOUSE = 'WAREHOUSE',
    SYSTEM = 'SYSTEM'
}

export enum MODULES {

    // ==============================================   SYSTEM ============================================== 
    USER = 'USER',
    EMPLOYEE = 'EMPLOYEE',
    SETTINGS = 'SETTINGS',
    ACCOUNT = 'ACCOUNT',
    CLASSIFICATION = 'CLASSIFICATION',
    DEPARTMENT = 'DEPARTMENT',
    PENDINGS = 'PENDINGS',
    DIVISION = 'DIVISION',

    // ==============================================   WAREHOUSE ============================================== 

    // =======================  PURCHASING ======================= 
    CANVASS = 'CANVASS',
    RV = 'RV',
    SPR = 'SPR',
    JO = 'JO',
    MEQS = 'MEQS',
    PO = 'PO',
    RR = 'RR',
    OSRIV = 'OSRIV',
    SERIV = 'SERIV',
    MRV = 'MRV',
    MCT = 'MCT',
    MCRT = 'MCRT',
    MST = 'MST',

    // =======================  DATA MANAGEMENT ======================= 
    SUPPLIER = 'SUPPLIER',
    UNIT = 'UNIT',
    PROJECT = 'PROJECT',
    ITEM = 'ITEM',
    
    // =======================  MOTORPOOL ======================= 
    VEHICLE = 'VEHICLE',
    FUEL_TYPE = 'FUEL_TYPE',
    GAS_STATION = 'GAS_STATION',
    TRIP_TICKET = 'TRIP_TICKET',
    GAS_SLIP = 'GAS_SLIP',

}

export enum ROUTES {



    // ==============================================   SYSTEM ============================================== 

    // =======================  USER ======================= 
    USER_INDEX = `${SERVICES.SYSTEM}_USER_INDEX`,
    USER_CREATE = `${SERVICES.SYSTEM}_USER_CREATE`,
    USER_UPDATE = `${SERVICES.SYSTEM}_USER_UPDATE`,
    USER_VIEW = `${SERVICES.SYSTEM}_USER_VIEW`,


    // =======================  EMPLOYEE ======================= 
    EMPLOYEE_INDEX = `${SERVICES.SYSTEM}_EMPLOYEE_INDEX`,
    EMPLOYEE_CREATE = `${SERVICES.SYSTEM}_EMPLOYEE_CREATE`,
    EMPLOYEE_UPDATE = `${SERVICES.SYSTEM}_EMPLOYEE_UPDATE`,
    EMPLOYEE_VIEW = `${SERVICES.SYSTEM}_EMPLOYEE_VIEW`,

    // =======================  ACCOUNT ======================= 
    ACCOUNT_INDEX = `${SERVICES.SYSTEM}_ACCOUNT_INDEX`,
    ACCOUNT_CREATE = `${SERVICES.SYSTEM}_ACCOUNT_CREATE`,
    ACCOUNT_UPDATE = `${SERVICES.SYSTEM}_ACCOUNT_UPDATE`,
    ACCOUNT_VIEW = `${SERVICES.SYSTEM}_ACCOUNT_VIEW`,

    // =======================  CLASSIFICATION ======================= 
    CLASSIFICATION_INDEX = `${SERVICES.SYSTEM}_CLASSIFICATION_INDEX`,
    CLASSIFICATION_CREATE = `${SERVICES.SYSTEM}_CLASSIFICATION_CREATE`,
    CLASSIFICATION_UPDATE = `${SERVICES.SYSTEM}_CLASSIFICATION_UPDATE`,
    CLASSIFICATION_VIEW = `${SERVICES.SYSTEM}_CLASSIFICATION_VIEW`,

    // =======================  DEPARTMENT ======================= 
    DEPARTMENT_INDEX = `${SERVICES.SYSTEM}_DEPARTMENT_INDEX`,
    DEPARTMENT_CREATE = `${SERVICES.SYSTEM}_DEPARTMENT_CREATE`,
    DEPARTMENT_UPDATE = `${SERVICES.SYSTEM}_DEPARTMENT_UPDATE`,
    DEPARTMENT_VIEW = `${SERVICES.SYSTEM}_DEPARTMENT_VIEW`,

    // =======================  DIVISION ======================= 
    DIVISION_INDEX = `${SERVICES.SYSTEM}_DIVISION_INDEX`,
    DIVISION_CREATE = `${SERVICES.SYSTEM}_DIVISION_CREATE`,
    DIVISION_UPDATE = `${SERVICES.SYSTEM}_DIVISION_UPDATE`,
    DIVISION_VIEW = `${SERVICES.SYSTEM}_DIVISION_VIEW`,
    


    // ==============================================   WAREHOUSE ============================================== 



    // =======================  CANVASS ======================= 
    CANVASS_INDEX = `${SERVICES.WAREHOUSE}_CANVASS_INDEX`,
    CANVASS_CREATE = `${SERVICES.WAREHOUSE}_CANVASS_CREATE`,
    CANVASS_UPDATE = `${SERVICES.WAREHOUSE}_CANVASS_UPDATE`,
    CANVASS_VIEW = `${SERVICES.WAREHOUSE}_CANVASS_VIEW`,

    // =======================  RV ======================= 
    RV_INDEX = `${SERVICES.WAREHOUSE}_RV_INDEX`,
    RV_CREATE = `${SERVICES.WAREHOUSE}_RV_CREATE`,
    RV_UPDATE = `${SERVICES.WAREHOUSE}_RV_UPDATE`,
    RV_VIEW = `${SERVICES.WAREHOUSE}_RV_VIEW`,

    // =======================  JO ======================= 
    JO_INDEX = `${SERVICES.WAREHOUSE}_JO_INDEX`,
    JO_CREATE = `${SERVICES.WAREHOUSE}_JO_CREATE`,
    JO_UPDATE = `${SERVICES.WAREHOUSE}_JO_UPDATE`,
    JO_VIEW = `${SERVICES.WAREHOUSE}_JO_VIEW`,

    // =======================  SPR ======================= 
    SPR_INDEX = `${SERVICES.WAREHOUSE}_SPR_INDEX`,
    SPR_CREATE = `${SERVICES.WAREHOUSE}_SPR_CREATE`,
    SPR_UPDATE = `${SERVICES.WAREHOUSE}_SPR_UPDATE`,
    SPR_VIEW = `${SERVICES.WAREHOUSE}_SPR_VIEW`,

    // =======================  MEQS ======================= 
    MEQS_INDEX = `${SERVICES.WAREHOUSE}_MEQS_INDEX`,
    MEQS_CREATE = `${SERVICES.WAREHOUSE}_MEQS_CREATE`,
    MEQS_UPDATE = `${SERVICES.WAREHOUSE}_MEQS_UPDATE`,
    MEQS_VIEW = `${SERVICES.WAREHOUSE}_MEQS_VIEW`,

    // =======================  PO ======================= 
    PO_INDEX = `${SERVICES.WAREHOUSE}_PO_INDEX`,
    PO_CREATE = `${SERVICES.WAREHOUSE}_PO_CREATE`,
    PO_UPDATE = `${SERVICES.WAREHOUSE}_PO_UPDATE`,
    PO_VIEW = `${SERVICES.WAREHOUSE}_PO_VIEW`,

    // =======================  RR ======================= 
    RR_INDEX = `${SERVICES.WAREHOUSE}_RR_INDEX`,
    RR_CREATE = `${SERVICES.WAREHOUSE}_RR_CREATE`,
    RR_UPDATE = `${SERVICES.WAREHOUSE}_RR_UPDATE`,
    RR_VIEW = `${SERVICES.WAREHOUSE}_RR_VIEW`,

    // =======================  OSRIV ======================= 
    OSRIV_INDEX = `${SERVICES.WAREHOUSE}_OSRIV_INDEX`,
    OSRIV_CREATE = `${SERVICES.WAREHOUSE}_OSRIV_CREATE`,
    OSRIV_UPDATE = `${SERVICES.WAREHOUSE}_OSRIV_UPDATE`,
    OSRIV_VIEW = `${SERVICES.WAREHOUSE}_OSRIV_VIEW`,

    // =======================  SERIV ======================= 
    SERIV_INDEX = `${SERVICES.WAREHOUSE}_SERIV_INDEX`,
    SERIV_CREATE = `${SERVICES.WAREHOUSE}_SERIV_CREATE`,
    SERIV_UPDATE = `${SERVICES.WAREHOUSE}_SERIV_UPDATE`,
    SERIV_VIEW = `${SERVICES.WAREHOUSE}_SERIV_VIEW`,

    // =======================  MRV ======================= 
    MRV_INDEX = `${SERVICES.WAREHOUSE}_MRV_INDEX`,
    MRV_CREATE = `${SERVICES.WAREHOUSE}_MRV_CREATE`,
    MRV_UPDATE = `${SERVICES.WAREHOUSE}_MRV_UPDATE`,
    MRV_VIEW = `${SERVICES.WAREHOUSE}_MRV_VIEW`,

    // =======================  MCT ======================= 
    MCT_INDEX = `${SERVICES.WAREHOUSE}_MCT_INDEX`,
    MCT_CREATE = `${SERVICES.WAREHOUSE}_MCT_CREATE`,
    MCT_UPDATE = `${SERVICES.WAREHOUSE}_MCT_UPDATE`,
    MCT_VIEW = `${SERVICES.WAREHOUSE}_MCT_VIEW`,

    // =======================  MCRT ======================= 
    MCRT_INDEX = `${SERVICES.WAREHOUSE}_MCRT_INDEX`,
    MCRT_CREATE = `${SERVICES.WAREHOUSE}_MCRT_CREATE`,
    MCRT_UPDATE = `${SERVICES.WAREHOUSE}_MCRT_UPDATE`,
    MCRT_VIEW = `${SERVICES.WAREHOUSE}_MCRT_VIEW`,

    // =======================  MST ======================= 
    MST_INDEX = `${SERVICES.WAREHOUSE}_MST_INDEX`,
    MST_CREATE = `${SERVICES.WAREHOUSE}_MST_CREATE`,
    MST_UPDATE = `${SERVICES.WAREHOUSE}_MST_UPDATE`,
    MST_VIEW = `${SERVICES.WAREHOUSE}_MST_VIEW`,

    // =======================  SUPPLIER ======================= 
    SUPPLIER_INDEX = `${SERVICES.WAREHOUSE}_SUPPLIER_INDEX`,
    SUPPLIER_CREATE = `${SERVICES.WAREHOUSE}_SUPPLIER_CREATE`,
    SUPPLIER_UPDATE = `${SERVICES.WAREHOUSE}_SUPPLIER_UPDATE`,
    SUPPLIER_VIEW = `${SERVICES.WAREHOUSE}_SUPPLIER_VIEW`,

    // =======================  UNIT ======================= 
    UNIT_INDEX = `${SERVICES.WAREHOUSE}_UNIT_INDEX`,
    UNIT_CREATE = `${SERVICES.WAREHOUSE}_UNIT_CREATE`,
    UNIT_UPDATE = `${SERVICES.WAREHOUSE}_UNIT_UPDATE`,
    UNIT_VIEW = `${SERVICES.WAREHOUSE}_UNIT_VIEW`,

    // =======================  ITEM ======================= 
    ITEM_INDEX = `${SERVICES.WAREHOUSE}_ITEM_INDEX`,
    ITEM_CREATE = `${SERVICES.WAREHOUSE}_ITEM_CREATE`,
    ITEM_UPDATE = `${SERVICES.WAREHOUSE}_ITEM_UPDATE`,
    ITEM_VIEW = `${SERVICES.WAREHOUSE}_ITEM_VIEW`,

    // =======================  ITEM ======================= 
    ITEM_TYPE_INDEX = `${SERVICES.WAREHOUSE}_ITEM_TYPE_INDEX`,
    ITEM_TYPE_CREATE = `${SERVICES.WAREHOUSE}_ITEM_TYPE_CREATE`,
    ITEM_TYPE_UPDATE = `${SERVICES.WAREHOUSE}_ITEM_TYPE_UPDATE`,
    ITEM_TYPE_VIEW = `${SERVICES.WAREHOUSE}_ITEM_TYPE_VIEW`,

    // =======================  PROJECT ======================= 
    PROJECT_INDEX = `${SERVICES.WAREHOUSE}_PROJECT_INDEX`,
    PROJECT_CREATE = `${SERVICES.WAREHOUSE}_PROJECT_CREATE`,
    PROJECT_UPDATE = `${SERVICES.WAREHOUSE}_PROJECT_UPDATE`,
    PROJECT_VIEW = `${SERVICES.WAREHOUSE}_PROJECT_VIEW`,



    // ==============================================   MOTORPOOL  ============================================== 

    // =======================  VEHICLE ======================= 
    VEHICLE_INDEX = `${SERVICES.WAREHOUSE}_VEHICLE_INDEX`,
    VEHICLE_CREATE = `${SERVICES.WAREHOUSE}_VEHICLE_CREATE`,
    VEHICLE_UPDATE = `${SERVICES.WAREHOUSE}_VEHICLE_UPDATE`,
    VEHICLE_VIEW = `${SERVICES.WAREHOUSE}_VEHICLE_VIEW`,

    // =======================  FUEL TYPE ======================= 
    FUEL_TYPE_INDEX = `${SERVICES.WAREHOUSE}_FUEL_TYPE_INDEX`,
    FUEL_TYPE_CREATE = `${SERVICES.WAREHOUSE}_FUEL_TYPE_CREATE`,
    FUEL_TYPE_UPDATE = `${SERVICES.WAREHOUSE}_FUEL_TYPE_UPDATE`,
    FUEL_TYPE_VIEW = `${SERVICES.WAREHOUSE}_FUEL_TYPE_VIEW`,

    // =======================  GAS STATION ======================= 
    GAS_STATION_INDEX = `${SERVICES.WAREHOUSE}_GAS_STATION_INDEX`,
    GAS_STATION_CREATE = `${SERVICES.WAREHOUSE}_GAS_STATION_CREATE`,
    GAS_STATION_UPDATE = `${SERVICES.WAREHOUSE}_GAS_STATION_UPDATE`,
    GAS_STATION_VIEW = `${SERVICES.WAREHOUSE}_GAS_STATION_VIEW`,

    // =======================  TRIP TICKET ======================= 
    TRIP_TICKET_INDEX = `${SERVICES.WAREHOUSE}_TRIP_TICKET_INDEX`,
    TRIP_TICKET_CREATE = `${SERVICES.WAREHOUSE}_TRIP_TICKET_CREATE`,
    TRIP_TICKET_UPDATE = `${SERVICES.WAREHOUSE}_TRIP_TICKET_UPDATE`,
    TRIP_TICKET_VIEW = `${SERVICES.WAREHOUSE}_TRIP_TICKET_VIEW`,

    // =======================  GAS SLIP ======================= 
    GAS_SLIP_INDEX = `${SERVICES.WAREHOUSE}_GAS_SLIP_INDEX`,
    GAS_SLIP_CREATE = `${SERVICES.WAREHOUSE}_GAS_SLIP_CREATE`,
    GAS_SLIP_UPDATE = `${SERVICES.WAREHOUSE}_GAS_SLIP_UPDATE`,
    GAS_SLIP_VIEW = `${SERVICES.WAREHOUSE}_GAS_SLIP_VIEW`,
}

export enum DB_ENTITY {
    RV = 'request_voucher',
    SPR = 'spare_parts_request',
    JO = 'job_order',
    MEQS = 'material_equipment_quotation_summary',
    PO = 'purchase_order',
    RR = 'receiving_report',
    OSRIV = 'osriv',
    SERIV = 'seriv',
    MRV = 'mrv',
    MCT = 'mct',
    MCRT = 'mcrt',
    MST = 'mst',
    TRIP_TICKET = 'trip_ticket',
    GAS_SLIP = 'gas_slip',
}

export const approvalStatus = {
    [APPROVAL_STATUS.PENDING]: {
        value: APPROVAL_STATUS.PENDING,
        label: 'Pending',
        color: 'orange',
    },
    [APPROVAL_STATUS.APPROVED]: {
        value: APPROVAL_STATUS.APPROVED,
        label: 'Approved',
        color: 'success',
    },
    [APPROVAL_STATUS.DISAPPROVED]: {
        value: APPROVAL_STATUS.DISAPPROVED,
        label: 'Disapproved',
        color: 'danger',
    },
    [APPROVAL_STATUS.CANCELLED]: {
        value: APPROVAL_STATUS.CANCELLED,
        label: 'Cancelled',
        color: 'warning',
    },
}

export const userStatus = {
    [USER_STATUS.ACTIVE]: {
        value: USER_STATUS.ACTIVE,
        label: 'Active',
        color: 'success',
    },
    [USER_STATUS.INACTIVE]: {
        value: USER_STATUS.INACTIVE,
        label: 'Inactive',
        color: 'danger',
    },
}

export const departmentStatus = {
    [DEPARTMENT_STATUS.ACTIVE]: {
        value: DEPARTMENT_STATUS.ACTIVE,
        label: 'Active',
        color: 'success',
    },
    [DEPARTMENT_STATUS.INACTIVE]: {
        value: DEPARTMENT_STATUS.INACTIVE,
        label: 'Inactive',
        color: 'danger',
    },
}

export const employeeStatus = {
    [EMPLOYEE_STATUS.ACTIVE]: {
        value: EMPLOYEE_STATUS.ACTIVE,
        label: 'Active',
        color: 'success',
    },
    [EMPLOYEE_STATUS.INACTIVE]: {
        value: EMPLOYEE_STATUS.INACTIVE,
        label: 'Inactive',
        color: 'danger',
    },
}

export const VAT = {
    [VAT_TYPE.NONE]: {
        value: VAT_TYPE.NONE,
        label: 'Non-VAT'
    },
    [VAT_TYPE.INC]: {
        value: VAT_TYPE.INC,
        label: 'INC'
    },
    [VAT_TYPE.EXC]: {
        value: VAT_TYPE.EXC,
        label: 'EXC'
    },
    [VAT_TYPE.EXEMPT]: {
        value: VAT_TYPE.EXC,
        label: 'VAT-Exempt'
    }
}

export const itemClass = {
    [ITEM_CLASS.NON_STOCK]: {
        value: ITEM_CLASS.NON_STOCK,
        label: 'Non-Stock'
    },
    [ITEM_CLASS.STOCK]: {
        value: ITEM_CLASS.STOCK,
        label: 'Stock'
    }
}

export const itemTransaction = {
    [ITEM_TRANSACTION_TYPE.STOCK_IN]: {
        value: ITEM_TRANSACTION_TYPE.STOCK_IN,
        label: 'Stock In'
    },
    [ITEM_TRANSACTION_TYPE.STOCK_OUT]: {
        value: ITEM_TRANSACTION_TYPE.STOCK_OUT,
        label: 'Stock Out'
    }
}

export const NOTE_OPTIONS = [
    'Design',
    'Features',
    'Performance',
    'Brand',
    'Durability',
    'Reliability',
    'Convenience',
    'Comfort',
    'Tradition',
    'Proven and Tested'
]

// map to url format
export const MODULE_MAPPER = {
    [DB_ENTITY.RV]: 'rv',
    [DB_ENTITY.SPR]: 'spr',
    [DB_ENTITY.JO]: 'jo',
    [DB_ENTITY.MEQS]: 'meqs',
    [DB_ENTITY.PO]: 'po',
    [DB_ENTITY.RR]: 'rr',
    [DB_ENTITY.OSRIV]: 'osriv',
    [DB_ENTITY.SERIV]: 'seriv',
    [DB_ENTITY.MRV]: 'mrv',
    [DB_ENTITY.MCT]: 'mct',
    [DB_ENTITY.MCRT]: 'mcrt',
    [DB_ENTITY.MST]: 'mst',
    [DB_ENTITY.TRIP_TICKET]: 'trip-ticket',
    [DB_ENTITY.GAS_SLIP]: 'gas-slip',
}

export const enum ITEM_TYPE {
    OFFICE_SUPPLY = 'OS',
    SPECIAL_EQUIPMENT = 'SE',
    LINE_MATERIALS = 'LM',
    SPARE_PARTS = 'SP',
}

export const enum WAREHOUSE_REQUEST_TYPE {
    TURN_ON_ORDER = 1,
    CONSTRUCTION_WORK_ORDER = 2,
    MAINTENANCE_WORK_ORDER = 3,
    STOCK_TRANSFER = 4,
    EMERGENCY_WITHDRAW = 5,
    SERVICE_REQUEST_ORDER = 6,
    HW_KIT_FABRICATED = 7,
}

export const warehouseRequestTypeMapper = {
    [WAREHOUSE_REQUEST_TYPE.TURN_ON_ORDER]: 'Turn On Order',
    [WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER]: 'Construction Work Order',
    [WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER]: 'Maintenance Work Order',
    [WAREHOUSE_REQUEST_TYPE.STOCK_TRANSFER]: 'Stock Transfer',
    [WAREHOUSE_REQUEST_TYPE.EMERGENCY_WITHDRAW]: 'Emergency Withdraw',
    [WAREHOUSE_REQUEST_TYPE.SERVICE_REQUEST_ORDER]: 'Service Request Order',
    [WAREHOUSE_REQUEST_TYPE.HW_KIT_FABRICATED]: 'H/W KIT FABRICATED',
}

export const WAREHOUSE_REQUEST_TYPES: WarehouseRequestType[] = [
    {
        id: WAREHOUSE_REQUEST_TYPE.TURN_ON_ORDER,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.TURN_ON_ORDER]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.STOCK_TRANSFER,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.STOCK_TRANSFER]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.EMERGENCY_WITHDRAW,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.EMERGENCY_WITHDRAW]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.SERVICE_REQUEST_ORDER,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.SERVICE_REQUEST_ORDER]
    },
    {
        id: WAREHOUSE_REQUEST_TYPE.HW_KIT_FABRICATED,
        name: warehouseRequestTypeMapper[WAREHOUSE_REQUEST_TYPE.HW_KIT_FABRICATED]
    },
]


export const enum ITEM_STATUS {
    NOT_USABLE = 0,
    USABLE = 1,
}

export const itemStatusMapper = {
    [ITEM_STATUS.USABLE]: 'Usable',
    [ITEM_STATUS.NOT_USABLE]: 'Not Usable',
}

export const itemStatusArray = [
    {
        id: ITEM_STATUS.USABLE,
        name: itemStatusMapper[ITEM_STATUS.USABLE]
    },
    {
        id: ITEM_STATUS.NOT_USABLE,
        name: itemStatusMapper[ITEM_STATUS.NOT_USABLE]
    }
]



export const approvalStatusArray = [
    { id: APPROVAL_STATUS.PENDING, label: approvalStatus[APPROVAL_STATUS.PENDING].label },
    { id: APPROVAL_STATUS.APPROVED, label: approvalStatus[APPROVAL_STATUS.APPROVED].label },
    { id: APPROVAL_STATUS.DISAPPROVED, label: approvalStatus[APPROVAL_STATUS.DISAPPROVED].label },
    { id: APPROVAL_STATUS.CANCELLED, label: approvalStatus[APPROVAL_STATUS.CANCELLED].label }
]