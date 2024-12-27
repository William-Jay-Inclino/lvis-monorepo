
export interface RvData {
    rc_number: string 
    supervisor: string
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