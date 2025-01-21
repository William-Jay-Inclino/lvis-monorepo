
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
    // PURCHASING
    CANVASS = 'canvass',
    RV = 'request_voucher',
    SPR = 'spare_parts_request',
    JO = 'job_order',
    MEQS = 'material_equipment_quotation_summary',
    PO = 'purchase_order',
    
    // WAREHOUSE
    RR = 'receiving_report',
    OSRIV = 'osriv',
    SERIV = 'seriv',
    MRV = 'mrv',
    MCT = 'mct',
    MCRT = 'mcrt',
    MST = 'mst',
    
    // MOTORPOOL
    GAS_SLIP = 'gas_slip',
    TRIP_TICKET = 'trip_ticket',
    VEHICLE = 'vehicle',
    VEHICLE_MAINTENANCE = 'vehicle_maintenance',
    SERVICES = 'vehicle_maintenance_detail',


    // DATA MANAGEMENT
    ITEM_TYPE = 'item_type',
    SUPPLIER = 'supplier',
    UNIT = 'unit',
    STATION = 'station',
    PROJECT = 'project',
    ITEM = 'item',
}

// export enum MODULES {

//     // ========= PURCHASING ========= 
//     CANVASS = 'CANVASS',
//     CANVASS_ITEM = 'CANVASS_ITEM',

//     RV = 'RV',
//     RV_APPROVER = 'RV_APPROVER',

//     SPR = 'SPR',
//     SPR_APPROVER = 'SPR_APPROVER',

//     JO = 'JO',
//     JO_APPROVER = 'JO_APPROVER',

//     MEQS = 'MEQS',
//     MEQS_APPROVER = 'MEQS_APPROVER',
//     MEQS_SUPPLIER = 'MEQS_SUPPLIER',
//     MEQS_SUPPLIER_ITEM = 'MEQS_SUPPLIER_ITEM',
//     MEQS_SUPPLIER_ATTACHMENT = 'MEQS_SUPPLIER_ATTACHMENT',

//     PO = 'PO',
//     PO_APPROVER = 'PO_APPROVER',

//     RR = 'RR',
//     RR_APPROVER = 'RR_APPROVER',
//     RR_ITEM = 'RR_ITEM',


//     // ========= WAREHOUSING ========= 
//     OSRIV = 'OSRIV',
//     OSRIV_APPROVER = 'OSRIV_APPROVER',
//     OSRIV_ITEM = 'OSRIV_ITEM',

//     SERIV = 'SERIV',
//     SERIV_APPROVER = 'SERIV_APPROVER',
//     SERIV_ITEM = 'SERIV_ITEM',

//     MRV = 'MRV',
//     MRV_APPROVER = 'MRV_APPROVER',
//     MRV_ITEM = 'MRV_ITEM',

//     MCT = 'MCT',
//     MCT_APPROVER = 'MCT_APPROVER',
//     MCT_ITEM = 'MCT_ITEM',

//     MCRT = 'MCRT',
//     MCRT_APPROVER = 'MCRT_APPROVER',
//     MCRT_ITEM = 'MCRT_ITEM',

//     MST = 'MST',
//     MST_APPROVER = 'MST_APPROVER',
//     MST_ITEM = 'MST_ITEM',

//     // ========= DATA MANAGEMENT ========= 
//     SUPPLIER = 'SUPPLIER',
//     UNIT = 'UNIT',
//     PROJECT = 'PROJECT',
//     VEHICLE = 'VEHICLE',
//     STATION = 'STATION',


//     // ========= STOCK INVENTORY ========= 
//     ITEM = 'ITEM',
//     ITEM_TYPE = 'ITEM_TYPE',

// }

// export enum RESOLVERS {

//     // ========= CANVASS ========= 
//     createCanvass = 'createCanvass',
//     canvasses = 'canvasses',
//     rc_numbers = 'rc_numbers',
//     canvass = 'canvass',
//     updateCanvass = 'updateCanvass',
//     removeCanvass = 'removeCanvass',
//     printCanvass = 'printCanvass',


//     // ========= RV ========= 
//     createRv = 'createRv',
//     rvs = 'rvs',
//     rv_numbers = 'rv_numbers',
//     rv = 'rv',
//     updateRv = 'updateRv',
//     cancelRv = 'cancelRv',
//     printRv = 'printRv',

//     // ========= SPR ========= 
//     createSpr = 'createSpr',
//     sprs = 'sprs',
//     spr_numbers = 'spr_numbers',
//     spr = 'spr',
//     updateSpr = 'updateSpr',
//     cancelSpr = 'cancelSpr',
//     printSpr = 'printSpr',


//     // ========= JO ========= 
//     createJo = 'createJo',
//     jos = 'jos',
//     jo_numbers = 'jo_numbers',
//     jo = 'jo',
//     updateJo = 'updateJo',
//     cancelJo = 'cancelJo',
//     printJo = 'printJo',


//     // ========= MEQS ========= 
//     createMeqs = 'createMeqs',
//     meqs = 'meqs',
//     meqs_numbers = 'meqs_numbers',
//     meq = 'meq',
//     updateMeqs = 'updateMeqs',
//     cancelMeqs = 'cancelMeqs',
//     printMeqs = 'printMeqs',


//     // ========= PO ========= 
//     createPo = 'createPo',
//     pos = 'pos',
//     po_numbers = 'po_numbers',
//     po = 'po',
//     updatePo = 'updatePo',
//     cancelPo = 'cancelPo',
//     printPo = 'printPo',


//     // ========= RR ========= 
//     createRr = 'createRr',
//     rrs = 'rrs',
//     rr_numbers = 'rr_numbers',
//     rr = 'rr',
//     updateRr = 'updateRr',
//     cancelRr = 'cancelRr',
//     printRr = 'printRr',

//     // ========= OSRIV ========= 
//     createOsriv = 'createOsriv',
//     osrivs = 'osrivs',
//     osriv_numbers = 'osriv_numbers',
//     osriv = 'osriv',
//     updateOsriv = 'updateOsriv',
//     cancelOsriv = 'cancelOsriv',
//     printOsriv = 'printOsriv',

//     // ========= SERIV ========= 
//     createSeriv = 'createSeriv',
//     serivs = 'serivs',
//     seriv_numbers = 'seriv_numbers',
//     seriv = 'seriv',
//     updateSeriv = 'updateSeriv',
//     cancelSeriv = 'cancelSeriv',
//     printSeriv = 'printSeriv',

//     // ========= MRV ========= 
//     createMrv = 'createMrv',
//     mrvs = 'mrvs',
//     mrv_numbers = 'mrv_numbers',
//     mrv = 'mrv',
//     updateMrv = 'updateMrv',
//     cancelMrv = 'cancelMrv',
//     printMrv = 'printMrv',

//     // ========= MCT ========= 
//     createMct = 'createMct',
//     mcts = 'mcts',
//     mct_numbers = 'mct_numbers',
//     mct = 'mct',
//     updateMct = 'updateMct',
//     cancelMct = 'cancelMct',
//     printMct = 'printMct',

//     // ========= MCRT ========= 
//     createMcrt = 'createMcrt',
//     mcrts = 'mcrts',
//     mcrt_numbers = 'mcrt_numbers',
//     mcrt = 'mcrt',
//     updateMcrt = 'updateMcrt',
//     cancelMcrt = 'cancelMcrt',
//     printMcrt = 'printMcrt',

//     // ========= MST ========= 
//     createMst = 'createMst',
//     msts = 'msts',
//     mst_numbers = 'mst_numbers',
//     mst = 'mst',
//     updateMst = 'updateMst',
//     cancelMst = 'cancelMst',
//     printMst = 'printMst',


//     // ========= SUPPLIER ========= 
//     createSupplier = 'createSupplier',
//     suppliers = 'suppliers',
//     supplier = 'supplier',
//     updateSupplier = 'updateSupplier',
//     removeSupplier = 'removeSupplier',


//     // ========= UNIT ========= 
//     createUnit = 'createUnit',
//     units = 'units',
//     unit = 'unit',
//     updateUnit = 'updateUnit',
//     removeUnit = 'removeUnit',


//     // ========= VEHICLE ========= 
//     createVehicle = 'createVehicle',
//     vehicles = 'vehicles',
//     vehicle = 'vehicle',
//     updateVehicle = 'updateVehicle',
//     removeVehicle = 'removeVehicle',

//     // ========= STATION ========= 
//     createStation = 'createStation',
//     stations = 'stations',
//     station = 'station',
//     updateStation = 'updateStation',
//     removeStation = 'removeStation',

//     // ========= PROJECT ========= 
//     createProject = 'createProject',
//     projects = 'projects',
//     project = 'project',
//     updateProject = 'updateProject',
//     removeProject = 'removeProject',


//     // ========= ITEM ========= 
//     createItem = 'createItem',
//     items = 'items',
//     item = 'item',
//     updateItem = 'updateItem',
//     removeItem = 'removeItem',


//     // ========= ITEM TYPE ========= 
//     createItemType = 'createItemType',
//     item_types = 'item_types',
//     item_type = 'item_type',
//     updateItemType = 'updateItemType',
//     removeItemType = 'removeItemType',

// }