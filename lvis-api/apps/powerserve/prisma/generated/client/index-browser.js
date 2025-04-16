
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
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
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

exports.Prisma.AuditScalarFieldEnum = {
  id: 'id',
  username: 'username',
  table: 'table',
  action: 'action',
  reference_id: 'reference_id',
  metadata: 'metadata',
  ip_address: 'ip_address',
  device_info: 'device_info',
  created_at: 'created_at',
  notes: 'notes'
};

exports.Prisma.LinemanScalarFieldEnum = {
  id: 'id',
  employee_id: 'employee_id',
  area_id: 'area_id',
  supervisor_id: 'supervisor_id',
  status: 'status'
};

exports.Prisma.AreaScalarFieldEnum = {
  id: 'id',
  oic_id: 'oic_id',
  name: 'name'
};

exports.Prisma.MunicipalityScalarFieldEnum = {
  id: 'id',
  area_id: 'area_id',
  name: 'name'
};

exports.Prisma.BarangayScalarFieldEnum = {
  id: 'id',
  municipality_id: 'municipality_id',
  name: 'name'
};

exports.Prisma.SitioScalarFieldEnum = {
  id: 'id',
  barangay_id: 'barangay_id',
  name: 'name'
};

exports.Prisma.FeederScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.WeatherConditionScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name'
};

exports.Prisma.DeviceScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name'
};

exports.Prisma.MeterBrandScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.UnitScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.ActivityCategoryCauseScalarFieldEnum = {
  id: 'id',
  category_id: 'category_id',
  code: 'code',
  name: 'name'
};

exports.Prisma.EquipmentScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name'
};

exports.Prisma.RemarksScalarFieldEnum = {
  id: 'id',
  min: 'min',
  max: 'max',
  label: 'label'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  category_id: 'category_id',
  unit_id: 'unit_id',
  code: 'code',
  name: 'name',
  quantity: 'quantity',
  num_of_personnel: 'num_of_personnel',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ActivityCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.ComplaintScalarFieldEnum = {
  id: 'id',
  report_type_id: 'report_type_id',
  complaint_status_id: 'complaint_status_id',
  assigned_group_id: 'assigned_group_id',
  assigned_group_type: 'assigned_group_type',
  ref_number: 'ref_number',
  complainant_name: 'complainant_name',
  complainant_contact_no: 'complainant_contact_no',
  description: 'description',
  remarks: 'remarks',
  created_by: 'created_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ComplaintDetailScalarFieldEnum = {
  id: 'id',
  complaint_id: 'complaint_id',
  consumer_id: 'consumer_id',
  barangay_id: 'barangay_id',
  sitio_id: 'sitio_id',
  landmark: 'landmark',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ComplaintStatusScalarFieldEnum = {
  id: 'id',
  name: 'name',
  color_class: 'color_class',
  description: 'description'
};

exports.Prisma.ComplaintReportTypeScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.ComplaintLogScalarFieldEnum = {
  id: 'id',
  complaint_id: 'complaint_id',
  complaint_status_id: 'complaint_status_id',
  remarks: 'remarks',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  ref_number: 'ref_number',
  complaint_id: 'complaint_id',
  assignee_id: 'assignee_id',
  task_status_id: 'task_status_id',
  activity_id: 'activity_id',
  description: 'description',
  remarks: 'remarks',
  accomplishment_qty: 'accomplishment_qty',
  action_taken: 'action_taken',
  acted_at: 'acted_at',
  created_by: 'created_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TaskAssignmentScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  area_id: 'area_id',
  department_id: 'department_id',
  division_id: 'division_id',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.TaskLogScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  task_status_id: 'task_status_id',
  remarks: 'remarks',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.TaskFileScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  filename: 'filename',
  source_path: 'source_path'
};

exports.Prisma.TaskStatusScalarFieldEnum = {
  id: 'id',
  name: 'name',
  color_class: 'color_class',
  description: 'description'
};

exports.Prisma.TaskDetailPowerInterruptionScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  feeder_id: 'feeder_id',
  weather_condition_id: 'weather_condition_id',
  device_id: 'device_id',
  cause_id: 'cause_id',
  barangay_id: 'barangay_id',
  distance_travel_in_km: 'distance_travel_in_km',
  affected_area: 'affected_area',
  equipment_failed: 'equipment_failed',
  fuse_rating: 'fuse_rating'
};

exports.Prisma.PowerInterruptionLinemanScalarFieldEnum = {
  id: 'id',
  task_detail_id: 'task_detail_id',
  lineman_id: 'lineman_id'
};

exports.Prisma.TaskDetailKwhMeterScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  barangay_id: 'barangay_id',
  cause_id: 'cause_id',
  distance_travel_in_km: 'distance_travel_in_km',
  meter_number: 'meter_number',
  meter_brand_id: 'meter_brand_id',
  last_reading: 'last_reading',
  initial_reading: 'initial_reading',
  meter_class: 'meter_class'
};

exports.Prisma.KwhMeterLinemanScalarFieldEnum = {
  id: 'id',
  task_detail_id: 'task_detail_id',
  lineman_id: 'lineman_id'
};

exports.Prisma.TaskDetailLineServicesScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  barangay_id: 'barangay_id',
  cause_id: 'cause_id',
  distance_travel_in_km: 'distance_travel_in_km',
  order_number: 'order_number',
  mrv_number: 'mrv_number',
  seriv_number: 'seriv_number',
  mst_number: 'mst_number',
  mcrt_number: 'mcrt_number'
};

exports.Prisma.LineServicesLinemanScalarFieldEnum = {
  id: 'id',
  task_detail_id: 'task_detail_id',
  lineman_id: 'lineman_id'
};

exports.Prisma.TaskDetailDlesScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  barangay_id: 'barangay_id',
  cause_id: 'cause_id',
  distance_travel_in_km: 'distance_travel_in_km',
  sco_number: 'sco_number',
  old_serial_number: 'old_serial_number',
  new_serial_number: 'new_serial_number',
  seriv_number: 'seriv_number',
  kva_rating: 'kva_rating'
};

exports.Prisma.DlesLinemanScalarFieldEnum = {
  id: 'id',
  task_detail_id: 'task_detail_id',
  lineman_id: 'lineman_id'
};

exports.Prisma.TaskDetailLmdgaScalarFieldEnum = {
  id: 'id',
  task_id: 'task_id',
  barangay_id: 'barangay_id',
  distance_travel_in_km: 'distance_travel_in_km',
  kva_rating: 'kva_rating',
  substation_id: 'substation_id',
  dt_location: 'dt_location',
  feeder_id: 'feeder_id',
  phase_number: 'phase_number',
  number_of_hc: 'number_of_hc',
  number_of_spans: 'number_of_spans',
  copper_aluminum_primary: 'copper_aluminum_primary',
  copper_aluminum_secondary: 'copper_aluminum_secondary',
  copper_aluminum_ground: 'copper_aluminum_ground',
  size_primary: 'size_primary',
  size_secondary: 'size_secondary',
  size_ground: 'size_ground',
  terminal_connector_primary: 'terminal_connector_primary',
  terminal_connector_secondary: 'terminal_connector_secondary',
  terminal_connector_ground: 'terminal_connector_ground',
  tap_position: 'tap_position',
  brand: 'brand',
  number_of_bushing_primary: 'number_of_bushing_primary',
  number_of_bushing_secondary: 'number_of_bushing_secondary',
  protective_device: 'protective_device',
  load_current_sec_bushing: 'load_current_sec_bushing',
  load_current_neutral: 'load_current_neutral',
  load_current_one: 'load_current_one',
  load_current_two: 'load_current_two',
  voltage_level_one: 'voltage_level_one',
  voltage_level_two: 'voltage_level_two',
  sec_line_conductor_size_one: 'sec_line_conductor_size_one',
  sec_line_conductor_size_two: 'sec_line_conductor_size_two'
};

exports.Prisma.LmdgaLinemanScalarFieldEnum = {
  id: 'id',
  task_detail_id: 'task_detail_id',
  lineman_id: 'lineman_id'
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
exports.LinemanStatus = exports.$Enums.LinemanStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.Prisma.ModelName = {
  Audit: 'Audit',
  Lineman: 'Lineman',
  Area: 'Area',
  Municipality: 'Municipality',
  Barangay: 'Barangay',
  Sitio: 'Sitio',
  Feeder: 'Feeder',
  WeatherCondition: 'WeatherCondition',
  Device: 'Device',
  MeterBrand: 'MeterBrand',
  Unit: 'Unit',
  ActivityCategoryCause: 'ActivityCategoryCause',
  Equipment: 'Equipment',
  Remarks: 'Remarks',
  Activity: 'Activity',
  ActivityCategory: 'ActivityCategory',
  Complaint: 'Complaint',
  ComplaintDetail: 'ComplaintDetail',
  ComplaintStatus: 'ComplaintStatus',
  ComplaintReportType: 'ComplaintReportType',
  ComplaintLog: 'ComplaintLog',
  Task: 'Task',
  TaskAssignment: 'TaskAssignment',
  TaskLog: 'TaskLog',
  TaskFile: 'TaskFile',
  TaskStatus: 'TaskStatus',
  TaskDetailPowerInterruption: 'TaskDetailPowerInterruption',
  PowerInterruptionLineman: 'PowerInterruptionLineman',
  TaskDetailKwhMeter: 'TaskDetailKwhMeter',
  KwhMeterLineman: 'KwhMeterLineman',
  TaskDetailLineServices: 'TaskDetailLineServices',
  LineServicesLineman: 'LineServicesLineman',
  TaskDetailDles: 'TaskDetailDles',
  DlesLineman: 'DlesLineman',
  TaskDetailLmdga: 'TaskDetailLmdga',
  LmdgaLineman: 'LmdgaLineman'
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
