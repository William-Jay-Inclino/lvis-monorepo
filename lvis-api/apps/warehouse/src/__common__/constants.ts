import { VAT_TYPE } from "./types";


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

export const enum DB_ENTITY {
    RV = 'request_voucher',
    SPR = 'spare_parts_request',
    JO = 'job_order',
    MEQS = 'material_equipment_quotation_summary',
    PO = 'purchase_order',
    RR = 'receiving_report',
    OSRIV = 'osriv',
    SERIV = 'seriv',
}

export const enum ITEM_TYPE {
    OFFICE_SUPPLY = 1,
    SPECIAL_EQUIPMENT = 2,
}

export const itemTypeMapper = {
    [ITEM_TYPE.OFFICE_SUPPLY]: 'Office Supply',
    [ITEM_TYPE.SPECIAL_EQUIPMENT]: 'Special Equipment',
}

export const enum WAREHOUSE_REQUEST_TYPE {
    MAINTENANCE_WORK_ORDER = 1,
}

export const warehouseRequestTypeMapper = {
    [WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER]: 'Maintenance Work Order',
}

export const MODULE_MAPPER = {
    [DB_ENTITY.RV]: {
        model: 'rV',
        rcNumber: 'rv_number',
        id: 'rv_id',
        approverModel: 'rVApprover',
        approvers: 'rv_approvers',
    },
    [DB_ENTITY.SPR]: {
        model: 'sPR',
        rcNumber: 'spr_number',
        id: 'spr_id',
        approverModel: 'sPRApprover',
        approvers: 'spr_approvers',
    },
    [DB_ENTITY.JO]: {
        model: 'jO',
        rcNumber: 'jo_number',
        id: 'jo_id',
        approverModel: 'jOApprover',
        approvers: 'jo_approvers',
    },
    [DB_ENTITY.MEQS]: {
        model: 'mEQS',
        rcNumber: 'meqs_number',
        id: 'meqs_id',
        approverModel: 'mEQSApprover',
        approvers: 'meqs_approvers',
    },
    [DB_ENTITY.PO]: {
        model: 'pO',
        rcNumber: 'po_number',
        id: 'po_id',
        approverModel: 'pOApprover',
        approvers: 'po_approvers',
    },
    [DB_ENTITY.RR]: {
        model: 'rR',
        rcNumber: 'rr_number',
        id: 'rr_id',
        approverModel: 'rRApprover',
        approvers: 'rr_approvers',
    },
    [DB_ENTITY.OSRIV]: {
        model: 'oSRIV',
        rcNumber: 'osriv_number',
        id: 'osriv_id',
        approverModel: 'oSRIVApprover',
        approvers: 'osriv_approvers',
    },
    [DB_ENTITY.SERIV]: {
        model: 'sERIV',
        rcNumber: 'seriv_number',
        id: 'seriv_id',
        approverModel: 'sERIVApprover',
        approvers: 'seriv_approvers',
    },
}