
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.8.1
 * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
 */
Prisma.prismaVersion = {
  client: "5.8.1",
  engine: "69d742ee20b815d88e17e54db4a2a7a3b30324e3"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ItemTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contact: 'contact',
  tin: 'tin',
  address: 'address',
  vat_type: 'vat_type',
  is_vat_registered: 'is_vat_registered',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.UnitScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  plate_number: 'plate_number',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.StationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.PendingScalarFieldEnum = {
  id: 'id',
  approver_id: 'approver_id',
  reference_number: 'reference_number',
  reference_table: 'reference_table',
  description: 'description',
  transaction_date: 'transaction_date'
};

exports.Prisma.ItemScalarFieldEnum = {
  id: 'id',
  item_type_id: 'item_type_id',
  unit_id: 'unit_id',
  code: 'code',
  name: 'name',
  description: 'description',
  total_quantity: 'total_quantity',
  initial_quantity: 'initial_quantity',
  alert_level: 'alert_level',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.ItemLocationScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  station_id: 'station_id',
  quantity_on_hand: 'quantity_on_hand',
  created_by: 'created_by',
  created_at: 'created_at',
  metadata: 'metadata'
};

exports.Prisma.ItemMovementScalarFieldEnum = {
  id: 'id',
  origin_id: 'origin_id',
  destination_id: 'destination_id',
  quantity_moved: 'quantity_moved',
  created_by: 'created_by',
  created_at: 'created_at',
  metadata: 'metadata'
};

exports.Prisma.ItemTransactionScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  rr_item_id: 'rr_item_id',
  type: 'type',
  quantity: 'quantity',
  price: 'price',
  remarks: 'remarks',
  is_initial: 'is_initial',
  created_at: 'created_at',
  created_by: 'created_by',
  metadata: 'metadata'
};

exports.Prisma.CanvassScalarFieldEnum = {
  id: 'id',
  rc_number: 'rc_number',
  date_requested: 'date_requested',
  purpose: 'purpose',
  notes: 'notes',
  requested_by_id: 'requested_by_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  deleted_by: 'deleted_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
  metadata: 'metadata'
};

exports.Prisma.CanvassItemScalarFieldEnum = {
  id: 'id',
  canvass_id: 'canvass_id',
  unit_id: 'unit_id',
  item_id: 'item_id',
  description: 'description',
  quantity: 'quantity',
  metadata: 'metadata'
};

exports.Prisma.RVScalarFieldEnum = {
  id: 'id',
  rv_number: 'rv_number',
  canvass_id: 'canvass_id',
  classification_id: 'classification_id',
  supervisor_id: 'supervisor_id',
  date_requested: 'date_requested',
  work_order_no: 'work_order_no',
  work_order_date: 'work_order_date',
  notes: 'notes',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.RVApproverScalarFieldEnum = {
  id: 'id',
  rv_id: 'rv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  is_supervisor: 'is_supervisor',
  metadata: 'metadata'
};

exports.Prisma.JOScalarFieldEnum = {
  id: 'id',
  jo_number: 'jo_number',
  date_requested: 'date_requested',
  canvass_id: 'canvass_id',
  equipment: 'equipment',
  classification_id: 'classification_id',
  department_id: 'department_id',
  supervisor_id: 'supervisor_id',
  notes: 'notes',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.JOApproverScalarFieldEnum = {
  id: 'id',
  jo_id: 'jo_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  is_supervisor: 'is_supervisor',
  metadata: 'metadata'
};

exports.Prisma.SPRScalarFieldEnum = {
  id: 'id',
  spr_number: 'spr_number',
  date_requested: 'date_requested',
  canvass_id: 'canvass_id',
  vehicle_id: 'vehicle_id',
  classification_id: 'classification_id',
  supervisor_id: 'supervisor_id',
  notes: 'notes',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.SPRApproverScalarFieldEnum = {
  id: 'id',
  spr_id: 'spr_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  is_supervisor: 'is_supervisor',
  metadata: 'metadata'
};

exports.Prisma.MEQSScalarFieldEnum = {
  id: 'id',
  jo_id: 'jo_id',
  rv_id: 'rv_id',
  spr_id: 'spr_id',
  meqs_number: 'meqs_number',
  meqs_date: 'meqs_date',
  notes: 'notes',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_by: 'cancelled_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  cancelled_at: 'cancelled_at',
  metadata: 'metadata'
};

exports.Prisma.MEQSSupplierScalarFieldEnum = {
  id: 'id',
  meqs_id: 'meqs_id',
  supplier_id: 'supplier_id',
  payment_terms: 'payment_terms',
  metadata: 'metadata'
};

exports.Prisma.MEQSSupplierItemScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  canvass_item_id: 'canvass_item_id',
  price: 'price',
  notes: 'notes',
  is_awarded: 'is_awarded',
  vat_type: 'vat_type',
  metadata: 'metadata'
};

exports.Prisma.MEQSSupplierAttachmentScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  filename: 'filename',
  src: 'src',
  metadata: 'metadata'
};

exports.Prisma.MEQSApproverScalarFieldEnum = {
  id: 'id',
  meqs_id: 'meqs_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.POScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  po_number: 'po_number',
  fund_source_id: 'fund_source_id',
  po_date: 'po_date',
  notes: 'notes',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.POApproverScalarFieldEnum = {
  id: 'id',
  po_id: 'po_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.RRScalarFieldEnum = {
  id: 'id',
  po_id: 'po_id',
  rr_number: 'rr_number',
  rr_date: 'rr_date',
  received_by_id: 'received_by_id',
  invoice_number: 'invoice_number',
  delivery_number: 'delivery_number',
  notes: 'notes',
  delivery_charge: 'delivery_charge',
  is_completed: 'is_completed',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.RRApproverScalarFieldEnum = {
  id: 'id',
  rr_id: 'rr_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.RRItemScalarFieldEnum = {
  id: 'id',
  rr_id: 'rr_id',
  meqs_supplier_item_id: 'meqs_supplier_item_id',
  quantity_accepted: 'quantity_accepted',
  metadata: 'metadata'
};

exports.Prisma.OSRIVScalarFieldEnum = {
  id: 'id',
  osriv_number: 'osriv_number',
  date_requested: 'date_requested',
  purpose: 'purpose',
  requested_by_id: 'requested_by_id',
  department_id: 'department_id',
  item_from_id: 'item_from_id',
  supervisor_id: 'supervisor_id',
  warehouse_custodian_id: 'warehouse_custodian_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.OSRIVApproverScalarFieldEnum = {
  id: 'id',
  osriv_id: 'osriv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  is_supervisor: 'is_supervisor',
  is_warehouse_custodian: 'is_warehouse_custodian',
  metadata: 'metadata'
};

exports.Prisma.OSRIVItemScalarFieldEnum = {
  id: 'id',
  osriv_id: 'osriv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  metadata: 'metadata'
};

exports.Prisma.SERIVScalarFieldEnum = {
  id: 'id',
  seriv_number: 'seriv_number',
  date_requested: 'date_requested',
  purpose: 'purpose',
  requested_by_id: 'requested_by_id',
  request_type: 'request_type',
  mwo_number: 'mwo_number',
  jo_number: 'jo_number',
  consumer_name: 'consumer_name',
  location: 'location',
  department_id: 'department_id',
  item_from_id: 'item_from_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.SERIVApproverScalarFieldEnum = {
  id: 'id',
  seriv_id: 'seriv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.SERIVItemScalarFieldEnum = {
  id: 'id',
  seriv_id: 'seriv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  metadata: 'metadata'
};

exports.Prisma.MRVScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  mrv_number: 'mrv_number',
  date_requested: 'date_requested',
  purpose: 'purpose',
  requested_by_id: 'requested_by_id',
  request_type: 'request_type',
  or_number: 'or_number',
  jo_number: 'jo_number',
  cwo_number: 'cwo_number',
  consumer_name: 'consumer_name',
  location: 'location',
  item_from_id: 'item_from_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.MRVApproverScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.MRVItemScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  metadata: 'metadata'
};

exports.Prisma.MCTScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  mct_number: 'mct_number',
  mct_date: 'mct_date',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.MCTApproverScalarFieldEnum = {
  id: 'id',
  mct_id: 'mct_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.MCRTScalarFieldEnum = {
  id: 'id',
  mct_id: 'mct_id',
  mcrt_number: 'mcrt_number',
  mcrt_date: 'mcrt_date',
  prepared_by_id: 'prepared_by_id',
  returned_by_id: 'returned_by_id',
  received_by_id: 'received_by_id',
  wo_number: 'wo_number',
  mo_number: 'mo_number',
  jo_number: 'jo_number',
  note: 'note',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.MCRTApproverScalarFieldEnum = {
  id: 'id',
  mcrt_id: 'mcrt_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order',
  metadata: 'metadata'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  ItemType: 'ItemType',
  Supplier: 'Supplier',
  Unit: 'Unit',
  Vehicle: 'Vehicle',
  Station: 'Station',
  Project: 'Project',
  Pending: 'Pending',
  Item: 'Item',
  ItemLocation: 'ItemLocation',
  ItemMovement: 'ItemMovement',
  ItemTransaction: 'ItemTransaction',
  Canvass: 'Canvass',
  CanvassItem: 'CanvassItem',
  RV: 'RV',
  RVApprover: 'RVApprover',
  JO: 'JO',
  JOApprover: 'JOApprover',
  SPR: 'SPR',
  SPRApprover: 'SPRApprover',
  MEQS: 'MEQS',
  MEQSSupplier: 'MEQSSupplier',
  MEQSSupplierItem: 'MEQSSupplierItem',
  MEQSSupplierAttachment: 'MEQSSupplierAttachment',
  MEQSApprover: 'MEQSApprover',
  PO: 'PO',
  POApprover: 'POApprover',
  RR: 'RR',
  RRApprover: 'RRApprover',
  RRItem: 'RRItem',
  OSRIV: 'OSRIV',
  OSRIVApprover: 'OSRIVApprover',
  OSRIVItem: 'OSRIVItem',
  SERIV: 'SERIV',
  SERIVApprover: 'SERIVApprover',
  SERIVItem: 'SERIVItem',
  MRV: 'MRV',
  MRVApprover: 'MRVApprover',
  MRVItem: 'MRVItem',
  MCT: 'MCT',
  MCTApprover: 'MCTApprover',
  MCRT: 'MCRT',
  MCRTApprover: 'MCRTApprover'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://github.com/prisma/prisma/issues`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
