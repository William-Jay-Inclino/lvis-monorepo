import { VAT_TYPE } from "./types";


export const enum SETTINGS {
    OSRIV_EXP_PERIOD_IN_DAYS = 'osriv_exp_period_in_days',
    SERIV_EXP_PERIOD_IN_DAYS = 'seriv_exp_period_in_days',
    MRV_EXP_PERIOD_IN_DAYS = 'mrv_exp_period_in_days',
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
        value: VAT_TYPE.EXEMPT,
        label: 'EXEMPT'
    },
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
}

// export const enum ITEM_TYPE {
//     OFFICE_SUPPLY = 1,
//     SPECIAL_EQUIPMENT = 2,
// }

// export const itemTypeMapper = {
//     [ITEM_TYPE.OFFICE_SUPPLY]: 'Office Supply',
//     [ITEM_TYPE.SPECIAL_EQUIPMENT]: 'Special Equipment',
// }

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

export interface ModuleMapping {
    model: string;
    rcNumber: string;
    id: string;
    approverModel: string;
    approvers: string;
    items: string;
}

export const MODULE_MAPPER: Record<DB_ENTITY, ModuleMapping> = {
    [DB_ENTITY.RV]: {
        model: 'rV',
        rcNumber: 'rv_number',
        id: 'rv_id',
        approverModel: 'rVApprover',
        approvers: 'rv_approvers',
        items: 'rv_items',
    },
    [DB_ENTITY.SPR]: {
        model: 'sPR',
        rcNumber: 'spr_number',
        id: 'spr_id',
        approverModel: 'sPRApprover',
        approvers: 'spr_approvers',
        items: 'spr_items',
    },
    [DB_ENTITY.JO]: {
        model: 'jO',
        rcNumber: 'jo_number',
        id: 'jo_id',
        approverModel: 'jOApprover',
        approvers: 'jo_approvers',
        items: 'jo_items',
    },
    [DB_ENTITY.MEQS]: {
        model: 'mEQS',
        rcNumber: 'meqs_number',
        id: 'meqs_id',
        approverModel: 'mEQSApprover',
        approvers: 'meqs_approvers',
        items: 'meqs_items',
    },
    [DB_ENTITY.PO]: {
        model: 'pO',
        rcNumber: 'po_number',
        id: 'po_id',
        approverModel: 'pOApprover',
        approvers: 'po_approvers',
        items: 'po_items',
    },
    [DB_ENTITY.RR]: {
        model: 'rR',
        rcNumber: 'rr_number',
        id: 'rr_id',
        approverModel: 'rRApprover',
        approvers: 'rr_approvers',
        items: 'rr_items',
    },
    [DB_ENTITY.OSRIV]: {
        model: 'oSRIV',
        rcNumber: 'osriv_number',
        id: 'osriv_id',
        approverModel: 'oSRIVApprover',
        approvers: 'osriv_approvers',
        items: 'osriv_items',
    },
    [DB_ENTITY.SERIV]: {
        model: 'sERIV',
        rcNumber: 'seriv_number',
        id: 'seriv_id',
        approverModel: 'sERIVApprover',
        approvers: 'seriv_approvers',
        items: 'seriv_items',
    },
    [DB_ENTITY.MRV]: {
        model: 'mRV',
        rcNumber: 'mrv_number',
        id: 'mrv_id',
        approverModel: 'mRVApprover',
        approvers: 'mrv_approvers',
        items: 'mrv_items',
    },
    [DB_ENTITY.MCT]: {
        model: 'mCT',
        rcNumber: 'mct_number',
        id: 'mct_id',
        approverModel: 'mCTApprover',
        approvers: 'mct_approvers',
        items: 'mct_items',
    },
    [DB_ENTITY.MCRT]: {
        model: 'mCRT',
        rcNumber: 'mcrt_number',
        id: 'mcrt_id',
        approverModel: 'mCRTApprover',
        approvers: 'mcrt_approvers',
        items: 'mcrt_items',
    },
    [DB_ENTITY.MST]: {
        model: 'mST',
        rcNumber: 'mst_number',
        id: 'mst_id',
        approverModel: 'mSTApprover',
        approvers: 'mst_approvers',
        items: 'mst_items',
    },
}