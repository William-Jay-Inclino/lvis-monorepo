
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.0.1
 * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
 */
Prisma.prismaVersion = {
  client: "6.0.1",
  engine: "5dbef10bdbfb579e07d35cc85fb1518d357cb99e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
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
  code: 'code',
  name: 'name',
  created_at: 'created_at'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contact: 'contact',
  tin: 'tin',
  address: 'address',
  vat_type: 'vat_type',
  is_vat_registered: 'is_vat_registered',
  contact_person: 'contact_person',
  remarks: 'remarks',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.UnitScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at'
};

exports.Prisma.StationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.PendingScalarFieldEnum = {
  id: 'id',
  approver_id: 'approver_id',
  reference_number: 'reference_number',
  reference_table: 'reference_table',
  description: 'description',
  transaction_date: 'transaction_date',
  approver_notes: 'approver_notes'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value'
};

exports.Prisma.MwoSequenceTrackerScalarFieldEnum = {
  id: 'id',
  yearMonth: 'yearMonth',
  sequence: 'sequence',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ItemScalarFieldEnum = {
  id: 'id',
  item_type_id: 'item_type_id',
  unit_id: 'unit_id',
  code: 'code',
  description: 'description',
  total_quantity: 'total_quantity',
  quantity_on_queue: 'quantity_on_queue',
  initial_quantity: 'initial_quantity',
  alert_level: 'alert_level',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.ProjectItemScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  item_id: 'item_id'
};

exports.Prisma.ItemLocationScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  station_id: 'station_id',
  quantity_on_hand: 'quantity_on_hand',
  created_at: 'created_at'
};

exports.Prisma.ItemMovementScalarFieldEnum = {
  id: 'id',
  origin_id: 'origin_id',
  destination_id: 'destination_id',
  quantity_moved: 'quantity_moved',
  created_at: 'created_at'
};

exports.Prisma.ItemTransactionScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  rr_item_id: 'rr_item_id',
  osriv_item_id: 'osriv_item_id',
  seriv_item_id: 'seriv_item_id',
  mrv_item_id: 'mrv_item_id',
  mcrt_item_id: 'mcrt_item_id',
  mst_item_id: 'mst_item_id',
  type: 'type',
  quantity: 'quantity',
  price: 'price',
  remarks: 'remarks',
  is_initial: 'is_initial',
  created_at: 'created_at',
  created_by: 'created_by'
};

exports.Prisma.ItemCodeTrackerScalarFieldEnum = {
  id: 'id',
  item_code: 'item_code',
  year: 'year',
  last_incremental: 'last_incremental'
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
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CanvassItemScalarFieldEnum = {
  id: 'id',
  canvass_id: 'canvass_id',
  unit_id: 'unit_id',
  item_id: 'item_id',
  description: 'description',
  quantity: 'quantity'
};

exports.Prisma.RVScalarFieldEnum = {
  id: 'id',
  rv_number: 'rv_number',
  canvass_number: 'canvass_number',
  canvass_id: 'canvass_id',
  classification_id: 'classification_id',
  date_requested: 'date_requested',
  work_order_no: 'work_order_no',
  work_order_date: 'work_order_date',
  notes: 'notes',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RVApproverScalarFieldEnum = {
  id: 'id',
  rv_id: 'rv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.JOScalarFieldEnum = {
  id: 'id',
  jo_number: 'jo_number',
  canvass_number: 'canvass_number',
  date_requested: 'date_requested',
  canvass_id: 'canvass_id',
  equipment: 'equipment',
  classification_id: 'classification_id',
  department_id: 'department_id',
  notes: 'notes',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.JOApproverScalarFieldEnum = {
  id: 'id',
  jo_id: 'jo_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.SPRScalarFieldEnum = {
  id: 'id',
  canvass_number: 'canvass_number',
  spr_number: 'spr_number',
  date_requested: 'date_requested',
  canvass_id: 'canvass_id',
  vehicle_id: 'vehicle_id',
  classification_id: 'classification_id',
  notes: 'notes',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SPRApproverScalarFieldEnum = {
  id: 'id',
  spr_id: 'spr_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.MEQSScalarFieldEnum = {
  id: 'id',
  jo_id: 'jo_id',
  jo_number: 'jo_number',
  rv_id: 'rv_id',
  rv_number: 'rv_number',
  spr_id: 'spr_id',
  spr_number: 'spr_number',
  meqs_number: 'meqs_number',
  meqs_date: 'meqs_date',
  notes: 'notes',
  approval_status: 'approval_status',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_by: 'cancelled_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  cancelled_at: 'cancelled_at'
};

exports.Prisma.MEQSSupplierScalarFieldEnum = {
  id: 'id',
  meqs_id: 'meqs_id',
  supplier_id: 'supplier_id',
  payment_terms: 'payment_terms'
};

exports.Prisma.MEQSSupplierItemScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  canvass_item_id: 'canvass_item_id',
  price: 'price',
  notes: 'notes',
  is_awarded: 'is_awarded',
  vat_type: 'vat_type'
};

exports.Prisma.MEQSSupplierAttachmentScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  filename: 'filename',
  src: 'src'
};

exports.Prisma.MEQSApproverScalarFieldEnum = {
  id: 'id',
  meqs_id: 'meqs_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.POScalarFieldEnum = {
  id: 'id',
  meqs_supplier_id: 'meqs_supplier_id',
  meqs_number: 'meqs_number',
  po_number: 'po_number',
  fund_source_id: 'fund_source_id',
  po_date: 'po_date',
  notes: 'notes',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.POApproverScalarFieldEnum = {
  id: 'id',
  po_id: 'po_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.RRScalarFieldEnum = {
  id: 'id',
  po_id: 'po_id',
  po_number: 'po_number',
  rr_number: 'rr_number',
  rr_date: 'rr_date',
  received_by_id: 'received_by_id',
  invoice_number: 'invoice_number',
  delivery_number: 'delivery_number',
  notes: 'notes',
  delivery_charge: 'delivery_charge',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RRApproverScalarFieldEnum = {
  id: 'id',
  rr_id: 'rr_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.RRItemScalarFieldEnum = {
  id: 'id',
  rr_id: 'rr_id',
  meqs_supplier_item_id: 'meqs_supplier_item_id',
  quantity_accepted: 'quantity_accepted'
};

exports.Prisma.OSRIVScalarFieldEnum = {
  id: 'id',
  osriv_number: 'osriv_number',
  date_requested: 'date_requested',
  exp_date: 'exp_date',
  purpose: 'purpose',
  note: 'note',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  requested_by_id: 'requested_by_id',
  item_from_id: 'item_from_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.OSRIVApproverScalarFieldEnum = {
  id: 'id',
  osriv_id: 'osriv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.OSRIVItemScalarFieldEnum = {
  id: 'id',
  osriv_id: 'osriv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.SERIVScalarFieldEnum = {
  id: 'id',
  seriv_number: 'seriv_number',
  date_requested: 'date_requested',
  exp_date: 'exp_date',
  purpose: 'purpose',
  note: 'note',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  request_type: 'request_type',
  or_number: 'or_number',
  mwo_number: 'mwo_number',
  cwo_number: 'cwo_number',
  jo_number: 'jo_number',
  consumer_name: 'consumer_name',
  location: 'location',
  requested_by_id: 'requested_by_id',
  withdrawn_by_id: 'withdrawn_by_id',
  item_from_id: 'item_from_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SERIVApproverScalarFieldEnum = {
  id: 'id',
  seriv_id: 'seriv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.SERIVItemScalarFieldEnum = {
  id: 'id',
  seriv_id: 'seriv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.MRVScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  mrv_number: 'mrv_number',
  date_requested: 'date_requested',
  exp_date: 'exp_date',
  purpose: 'purpose',
  note: 'note',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  request_type: 'request_type',
  or_number: 'or_number',
  mwo_number: 'mwo_number',
  cwo_number: 'cwo_number',
  jo_number: 'jo_number',
  consumer_name: 'consumer_name',
  location: 'location',
  requested_by_id: 'requested_by_id',
  withdrawn_by_id: 'withdrawn_by_id',
  item_from_id: 'item_from_id',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MRVApproverScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.MRVItemScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  item_id: 'item_id',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.MCTScalarFieldEnum = {
  id: 'id',
  mrv_id: 'mrv_id',
  mrv_number: 'mrv_number',
  mct_number: 'mct_number',
  mct_date: 'mct_date',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MCTApproverScalarFieldEnum = {
  id: 'id',
  mct_id: 'mct_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.MCRTScalarFieldEnum = {
  id: 'id',
  mct_id: 'mct_id',
  mct_number: 'mct_number',
  seriv_id: 'seriv_id',
  seriv_number: 'seriv_number',
  mcrt_number: 'mcrt_number',
  mcrt_date: 'mcrt_date',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  returned_by_id: 'returned_by_id',
  note: 'note',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MCRTApproverScalarFieldEnum = {
  id: 'id',
  mcrt_id: 'mcrt_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.MCRTItemScalarFieldEnum = {
  id: 'id',
  mcrt_id: 'mcrt_id',
  item_id: 'item_id',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.MSTScalarFieldEnum = {
  id: 'id',
  mst_number: 'mst_number',
  mst_date: 'mst_date',
  is_completed: 'is_completed',
  approval_status: 'approval_status',
  returned_by_id: 'returned_by_id',
  cwo_number: 'cwo_number',
  mwo_number: 'mwo_number',
  jo_number: 'jo_number',
  remarks: 'remarks',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MSTApproverScalarFieldEnum = {
  id: 'id',
  mst_id: 'mst_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.MSTItemScalarFieldEnum = {
  id: 'id',
  mst_id: 'mst_id',
  item_id: 'item_id',
  quantity: 'quantity',
  price: 'price',
  status: 'status'
};

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  vehicle_number: 'vehicle_number',
  plate_number: 'plate_number',
  rf_id: 'rf_id',
  classification_id: 'classification_id',
  assignee_id: 'assignee_id',
  name: 'name',
  date_acquired: 'date_acquired',
  status: 'status',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at'
};

exports.Prisma.TripTicketScalarFieldEnum = {
  id: 'id',
  trip_number: 'trip_number',
  vehicle_id: 'vehicle_id',
  driver_id: 'driver_id',
  passengers: 'passengers',
  destination: 'destination',
  purpose: 'purpose',
  start_time: 'start_time',
  end_time: 'end_time',
  actual_start_time: 'actual_start_time',
  actual_end_time: 'actual_end_time',
  is_operation: 'is_operation',
  is_stay_in: 'is_stay_in',
  is_personal: 'is_personal',
  is_out_of_coverage: 'is_out_of_coverage',
  prepared_by_id: 'prepared_by_id',
  status: 'status',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TripTicketApproverScalarFieldEnum = {
  id: 'id',
  trip_ticket_id: 'trip_ticket_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.GasSlipScalarFieldEnum = {
  id: 'id',
  gas_slip_number: 'gas_slip_number',
  vehicle_id: 'vehicle_id',
  driver_id: 'driver_id',
  gas_station_id: 'gas_station_id',
  fuel_type_id: 'fuel_type_id',
  requested_by_id: 'requested_by_id',
  approval_status: 'approval_status',
  with_container: 'with_container',
  liter_in_text: 'liter_in_text',
  actual_liter: 'actual_liter',
  price_per_liter: 'price_per_liter',
  purpose: 'purpose',
  is_posted: 'is_posted',
  print_count: 'print_count',
  cancelled_by: 'cancelled_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  cancelled_at: 'cancelled_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.GasSlipApproverScalarFieldEnum = {
  id: 'id',
  gas_slip_id: 'gas_slip_id',
  approver_id: 'approver_id',
  date_approval: 'date_approval',
  notes: 'notes',
  status: 'status',
  label: 'label',
  order: 'order'
};

exports.Prisma.GasStationScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.FuelTypeScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.VehicleServiceScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.ServiceCenterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  contact_person: 'contact_person',
  contact_number: 'contact_number',
  remarks: 'remarks'
};

exports.Prisma.VehicleMaintenanceScalarFieldEnum = {
  id: 'id',
  ref_number: 'ref_number',
  vehicle_id: 'vehicle_id',
  service_center_id: 'service_center_id',
  service_date: 'service_date',
  service_mileage: 'service_mileage',
  next_service_date: 'next_service_date',
  next_service_mileage: 'next_service_mileage',
  cost: 'cost',
  remarks: 'remarks',
  performed_by: 'performed_by',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.VehicleMaintenanceDetailScalarFieldEnum = {
  id: 'id',
  maintenance_id: 'maintenance_id',
  service_id: 'service_id',
  note: 'note'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  ItemType: 'ItemType',
  Supplier: 'Supplier',
  Unit: 'Unit',
  Station: 'Station',
  Project: 'Project',
  Pending: 'Pending',
  Setting: 'Setting',
  MwoSequenceTracker: 'MwoSequenceTracker',
  Item: 'Item',
  ProjectItem: 'ProjectItem',
  ItemLocation: 'ItemLocation',
  ItemMovement: 'ItemMovement',
  ItemTransaction: 'ItemTransaction',
  ItemCodeTracker: 'ItemCodeTracker',
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
  MCRTApprover: 'MCRTApprover',
  MCRTItem: 'MCRTItem',
  MST: 'MST',
  MSTApprover: 'MSTApprover',
  MSTItem: 'MSTItem',
  Vehicle: 'Vehicle',
  TripTicket: 'TripTicket',
  TripTicketApprover: 'TripTicketApprover',
  GasSlip: 'GasSlip',
  GasSlipApprover: 'GasSlipApprover',
  GasStation: 'GasStation',
  FuelType: 'FuelType',
  VehicleService: 'VehicleService',
  ServiceCenter: 'ServiceCenter',
  VehicleMaintenance: 'VehicleMaintenance',
  VehicleMaintenanceDetail: 'VehicleMaintenanceDetail'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
