
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
 * Query Engine version: bf0e5e8a04cada8225617067eaa03d041e2bba36
 */
Prisma.prismaVersion = {
  client: "5.8.1",
  engine: "bf0e5e8a04cada8225617067eaa03d041e2bba36"
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
  updated_at: 'updated_at'
};

exports.Prisma.TripTicketScalarFieldEnum = {
  id: 'id',
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
  prepared_by: 'prepared_by',
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
  order: 'order',
  updated_by: 'updated_by',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.GasSlipScalarFieldEnum = {
  id: 'id',
  gas_slip_number: 'gas_slip_number',
  vehicle_id: 'vehicle_id',
  driver_id: 'driver_id',
  gas_station_id: 'gas_station_id',
  fuel_type_id: 'fuel_type_id',
  requested_by_id: 'requested_by_id',
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
  order: 'order',
  updated_by: 'updated_by',
  updated_at: 'updated_at',
  metadata: 'metadata'
};

exports.Prisma.GasStationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  contact_number: 'contact_number'
};

exports.Prisma.FuelTypeScalarFieldEnum = {
  id: 'id',
  name: 'name'
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

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  Vehicle: 'Vehicle',
  TripTicket: 'TripTicket',
  TripTicketApprover: 'TripTicketApprover',
  GasSlip: 'GasSlip',
  GasSlipApprover: 'GasSlipApprover',
  GasStation: 'GasStation',
  FuelType: 'FuelType'
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
