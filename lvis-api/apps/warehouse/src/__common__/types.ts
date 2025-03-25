
export interface Unit {
    id: string
    name: string
}

export interface Vehicle {
    id: string
    name: string
    plate_number: string
    created_by: string
}

export interface Supplier {
    id: string
    name: string
    contact: string
    tin: string
    address: string
    vat_type: VAT_TYPE
    is_vat_registered: boolean
    created_by: string
}

export interface Station {
    id: string 
    name: string 
}

export interface Project {
    id: string 
    name: string 
}

export interface VehicleService {
    id: string
    name: string 
}

export interface ServiceCenter {
    id: string
    name: string 
    location: string
}

export interface ItemType {
    id: number
    name: string
    code: string
}

export interface ItemCodeTracker {
    id: number
    item_code: string
    year: number
    last_incremental: number
}

export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string
    name_prefix: string
    name_suffix: string
}

export enum APPROVAL_STATUS {
    PENDING = 1,
    APPROVED = 2,
    DISAPPROVED = 3,
    CANCELLED = 4,
}

export enum REQUEST_TYPE {
    JO = 1,
    RV = 2,
    SPR = 3
}

export enum VAT_TYPE {
    NONE = 1,
    INC = 2,
    EXC = 3,
    EXEMPT = 4
}

export enum ITEM_TRANSACTION_TYPE {
    STOCK_IN = 1,
    STOCK_OUT = 2
}

export enum ITEM_CLASS {
    STOCK = 1,
    NON_STOCK = 2
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum DB_TABLE {
    NONE = 'N/A',

    // PURCHASING
    CANVASS = 'canvass',
    CANVASS_ITEM = 'canvass_item',
    RV = 'request_voucher',
    SPR = 'spare_parts_request',
    JO = 'job_order',
    MEQS = 'material_equipment_quotation_summary',
    MEQS_SUPPLIER = 'meqs_supplier',
    MEQS_SUPPLIER_ITEM = 'meqs_supplier_item',
    MEQS_SUPPLIER_ATTACHMENT = 'meqs_supplier_attachment',
    PO = 'purchase_order',
    
    // WAREHOUSE
    RR = 'receiving_report',
    RR_ITEMS = 'rr_item',
    OSRIV = 'osriv',
    OSRIV_APPROVER = 'osriv_approver',
    OSRIV_ITEM = 'osriv_item',
    SERIV = 'seriv',
    SERIV_APPROVER = 'seriv_approver',
    SERIV_ITEM = 'seriv_item',
    MRV = 'mrv',
    MRV_APPROVER = 'mrv_approver',
    MRV_ITEM = 'mrv_item',
    MCT = 'mct',
    MCRT = 'mcrt',
    MCRT_APPROVER = 'mcrt_approver',
    MCRT_ITEM = 'mcrt_item',
    MST = 'mst',
    MST_APPROVER = 'mst_approver',
    MST_ITEM = 'mst_item',
    
    // MOTORPOOL
    GAS_SLIP = 'gas_slip',
    GAS_SLIP_APPROVER = 'gas_slip_approver',
    TRIP_TICKET = 'trip_ticket',
    TRIP_TICKET_APPROVER = 'trip_ticket_approver',
    VEHICLE = 'vehicle',
    VEHICLE_MAINTENANCE = 'vehicle_maintenance',
    VEHICLE_MAINTENANCE_DETAIL = 'vehicle_maintenance_detail',


    // DATA MANAGEMENT
    PENDING = 'pending',
    ITEM_TYPE = 'item_type',
    SUPPLIER = 'supplier',
    UNIT = 'unit',
    STATION = 'station',
    PROJECT = 'project',
    ITEM = 'item',
    ITEM_TRANSACTION = 'item_transaction',
}