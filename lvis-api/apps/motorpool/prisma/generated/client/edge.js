
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  detectRuntime,
} = require('./runtime/edge')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/jay/Documents/projects/leyeco/lvis-monorepo/lvis-api/apps/motorpool/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/jay/Documents/projects/leyeco/lvis-monorepo/lvis-api/apps/motorpool/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.8.1",
  "engineVersion": "bf0e5e8a04cada8225617067eaa03d041e2bba36",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Z2VuZXJhdG9yIGNsaWVudCB7CiAgb3V0cHV0ICAgPSAiLi9nZW5lcmF0ZWQvY2xpZW50IgogIHByb3ZpZGVyID0gInByaXNtYS1jbGllbnQtanMiCn0KCmRhdGFzb3VyY2UgZGIgewogIHByb3ZpZGVyID0gInBvc3RncmVzcWwiCiAgdXJsICAgICAgPSBlbnYoIkRBVEFCQVNFX1VSTCIpCn0KCm1vZGVsIFZlaGljbGUgewogIGlkICAgICAgICAgICAgU3RyaW5nICAgICBAaWQgQGRlZmF1bHQodXVpZCgpKQogIHZlaGljbGVfbnVtYmVyIFN0cmluZyBAdW5pcXVlCiAgcGxhdGVfbnVtYmVyIFN0cmluZyBAdW5pcXVlCiAgcmZfaWQgU3RyaW5nIEB1bmlxdWUKICBjbGFzc2lmaWNhdGlvbl9pZCBJbnQgCiAgYXNzaWduZWVfaWQgU3RyaW5nIAogIG5hbWUgU3RyaW5nIAogIGRhdGVfYWNxdWlyZWQgRGF0ZVRpbWUKICBzdGF0dXMgSW50IAoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lICBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lICBAdXBkYXRlZEF0CgogIHRyaXBfdGlja2V0cyBUcmlwVGlja2V0W10KICBnYXNfc2xpcHMgR2FzU2xpcFtdCgogIEBAaW5kZXgoW2Fzc2lnbmVlX2lkLCBjbGFzc2lmaWNhdGlvbl9pZCwgc3RhdHVzXSkgCiAgQEBtYXAoInZlaGljbGUiKQp9Cgptb2RlbCBUcmlwVGlja2V0IHsKICBpZCAgICAgICAgICAgIFN0cmluZyAgICAgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICB2ZWhpY2xlX2lkIFN0cmluZwogIGRyaXZlcl9pZCBTdHJpbmcKICBwYXNzZW5nZXJzIFN0cmluZyAKICBkZXN0aW5hdGlvbiBTdHJpbmcgCiAgcHVycG9zZSBTdHJpbmcgCiAgc3RhcnRfdGltZSBEYXRlVGltZQogIGVuZF90aW1lIERhdGVUaW1lCiAgYWN0dWFsX3N0YXJ0X3RpbWUgRGF0ZVRpbWU/ICAKICBhY3R1YWxfZW5kX3RpbWUgRGF0ZVRpbWU/CgogIGlzX29wZXJhdGlvbiBCb29sZWFuICAgCiAgaXNfc3RheV9pbiBCb29sZWFuICAgCiAgaXNfcGVyc29uYWwgQm9vbGVhbiAgIAogIGlzX291dF9vZl9jb3ZlcmFnZSBCb29sZWFuICAgCiAgCiAgcHJlcGFyZWRfYnlfaWQgU3RyaW5nIAogIHN0YXR1cyBJbnQKCiAgY2FuY2VsbGVkX2J5IFN0cmluZz8KICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjYW5jZWxsZWRfYXQgRGF0ZVRpbWU/CiAgY3JlYXRlZF9hdCBEYXRlVGltZSAgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZF9hdCBEYXRlVGltZSAgQHVwZGF0ZWRBdAoKICB2ZWhpY2xlIFZlaGljbGUgQHJlbGF0aW9uKGZpZWxkczogW3ZlaGljbGVfaWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogUmVzdHJpY3QpCiAgdHJpcF90aWNrZXRfYXBwcm92ZXJzIFRyaXBUaWNrZXRBcHByb3ZlcltdCgogIEBAaW5kZXgoW3N0YXJ0X3RpbWUsIGVuZF90aW1lLCBhY3R1YWxfc3RhcnRfdGltZSwgYWN0dWFsX2VuZF90aW1lLCBzdGF0dXNdKQogIEBAbWFwKCJ0cmlwX3RpY2tldCIpCn0KCm1vZGVsIFRyaXBUaWNrZXRBcHByb3ZlciB7CiAgaWQgICAgICAgICAgICBTdHJpbmcgICAgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICB0cmlwX3RpY2tldF9pZCAgICAgICAgIFN0cmluZwogIGFwcHJvdmVyX2lkICAgU3RyaW5nCiAgZGF0ZV9hcHByb3ZhbCBEYXRlVGltZT8KICBub3RlcyAgICAgICAgIFN0cmluZwogIHN0YXR1cyAgICAgICAgSW50CiAgbGFiZWwgICAgICAgICBTdHJpbmcKICBvcmRlciAgICAgICAgIEludAoKICB1cGRhdGVkX2J5ICAgU3RyaW5nPwogIHVwZGF0ZWRfYXQgICBEYXRlVGltZSAgQHVwZGF0ZWRBdAoKICB0cmlwX3RpY2tldCBUcmlwVGlja2V0IEByZWxhdGlvbihmaWVsZHM6IFt0cmlwX3RpY2tldF9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQoKICBtZXRhZGF0YSBKc29uPwoKICBAQHVuaXF1ZShbdHJpcF90aWNrZXRfaWQsIG9yZGVyXSkKICBAQGluZGV4KFt0cmlwX3RpY2tldF9pZF0pCiAgQEBtYXAoInRyaXBfdGlja2V0X2FwcHJvdmVyIikKfQoKbW9kZWwgR2FzU2xpcCB7CiAgaWQgICAgICAgICAgICBTdHJpbmcgICAgIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgZ2FzX3NsaXBfbnVtYmVyIFN0cmluZyBAdW5pcXVlCiAgdmVoaWNsZV9pZCBTdHJpbmcKICBkcml2ZXJfaWQgU3RyaW5nICAKICBnYXNfc3RhdGlvbl9pZCBJbnQgCiAgZnVlbF90eXBlX2lkIEludCAKICByZXF1ZXN0ZWRfYnlfaWQgU3RyaW5nIAogIAogIHdpdGhfY29udGFpbmVyIEJvb2xlYW4gCiAgbGl0ZXJfaW5fdGV4dCBTdHJpbmcgCiAgYWN0dWFsX2xpdGVyIEZsb2F0ICAKICBwcmljZV9wZXJfbGl0ZXIgRmxvYXQgIAogIHB1cnBvc2UgU3RyaW5nIAogIGlzX3Bvc3RlZCBCb29sZWFuIEBkZWZhdWx0KGZhbHNlKQogIAogIHByaW50X2NvdW50IEludCBAZGVmYXVsdCgwKQoKICBjYW5jZWxsZWRfYnkgU3RyaW5nPwogIGNyZWF0ZWRfYnkgU3RyaW5nCiAgdXBkYXRlZF9ieSBTdHJpbmc/CgogIGNhbmNlbGxlZF9hdCBEYXRlVGltZT8KICBjcmVhdGVkX2F0IERhdGVUaW1lICBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lICBAdXBkYXRlZEF0CgogIHZlaGljbGUgVmVoaWNsZSBAcmVsYXRpb24oZmllbGRzOiBbdmVoaWNsZV9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBSZXN0cmljdCkKICBnYXNfc3RhdGlvbiBHYXNTdGF0aW9uIEByZWxhdGlvbihmaWVsZHM6IFtnYXNfc3RhdGlvbl9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBSZXN0cmljdCkKICBmdWVsX3R5cGUgRnVlbFR5cGUgQHJlbGF0aW9uKGZpZWxkczogW2Z1ZWxfdHlwZV9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBSZXN0cmljdCkKICBnYXNfc2xpcF9hcHByb3ZlcnMgR2FzU2xpcEFwcHJvdmVyW10KCiAgQEBpbmRleChbdmVoaWNsZV9pZCwgZHJpdmVyX2lkLCBnYXNfc3RhdGlvbl9pZCwgcmVxdWVzdGVkX2J5X2lkXSkgCiAgQEBtYXAoImdhc19zbGlwIikKfQoKbW9kZWwgR2FzU2xpcEFwcHJvdmVyIHsKICBpZCAgICAgICAgICAgIFN0cmluZyAgICBAaWQgQGRlZmF1bHQodXVpZCgpKQogIGdhc19zbGlwX2lkICAgICAgICAgU3RyaW5nCiAgYXBwcm92ZXJfaWQgICBTdHJpbmcKICBkYXRlX2FwcHJvdmFsIERhdGVUaW1lPwogIG5vdGVzICAgICAgICAgU3RyaW5nCiAgc3RhdHVzICAgICAgICBJbnQKICBsYWJlbCAgICAgICAgIFN0cmluZwogIG9yZGVyICAgICAgICAgSW50CgogIHVwZGF0ZWRfYnkgICBTdHJpbmc/CiAgdXBkYXRlZF9hdCAgIERhdGVUaW1lICBAdXBkYXRlZEF0CgogIGdhc19zbGlwIEdhc1NsaXAgQHJlbGF0aW9uKGZpZWxkczogW2dhc19zbGlwX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpCgogIG1ldGFkYXRhIEpzb24/CgogIEBAdW5pcXVlKFtnYXNfc2xpcF9pZCwgb3JkZXJdKQogIEBAaW5kZXgoW2dhc19zbGlwX2lkXSkKICBAQG1hcCgiZ2FzX3NsaXBfYXBwcm92ZXIiKQp9Cgptb2RlbCBHYXNTdGF0aW9uIHsKICBpZCAgICAgICAgIEludCAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICBuYW1lIFN0cmluZwogIGxvY2F0aW9uIFN0cmluZwogIGNvbnRhY3RfbnVtYmVyIFN0cmluZwoKICBnYXNfc2xpcHMgR2FzU2xpcFtdCgogIEBAbWFwKCJnYXNfc3RhdGlvbiIpCn0KCm1vZGVsIEZ1ZWxUeXBlIHsKICBpZCAgICAgICAgIEludCAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICBuYW1lIFN0cmluZwoKICBnYXNfc2xpcHMgR2FzU2xpcFtdCgogIEBAbWFwKCJmdWVsX3R5cGUiKQp9",
  "inlineSchemaHash": "5c30037a8d6e8c94036fd02ac9ce1ffb0f5d371ec81d3e0cda036ed4eef41b72"
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Vehicle\":{\"dbName\":\"vehicle\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"plate_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rf_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"classification_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignee_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date_acquired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"trip_tickets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TripTicket\",\"relationName\":\"TripTicketToVehicle\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slips\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasSlip\",\"relationName\":\"GasSlipToVehicle\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TripTicket\":{\"dbName\":\"trip_ticket\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"driver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passengers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"destination\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"start_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"end_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actual_start_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actual_end_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_operation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_stay_in\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_personal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_out_of_coverage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prepared_by_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelled_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelled_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"vehicle\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Vehicle\",\"relationName\":\"TripTicketToVehicle\",\"relationFromFields\":[\"vehicle_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trip_ticket_approvers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TripTicketApprover\",\"relationName\":\"TripTicketToTripTicketApprover\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TripTicketApprover\":{\"dbName\":\"trip_ticket_approver\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trip_ticket_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date_approval\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"trip_ticket\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TripTicket\",\"relationName\":\"TripTicketToTripTicketApprover\",\"relationFromFields\":[\"trip_ticket_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"trip_ticket_id\",\"order\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"trip_ticket_id\",\"order\"]}],\"isGenerated\":false},\"GasSlip\":{\"dbName\":\"gas_slip\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slip_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"driver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_station_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fuel_type_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requested_by_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"with_container\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"liter_in_text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actual_liter\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price_per_liter\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_posted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"print_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelled_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelled_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"vehicle\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Vehicle\",\"relationName\":\"GasSlipToVehicle\",\"relationFromFields\":[\"vehicle_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_station\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasStation\",\"relationName\":\"GasSlipToGasStation\",\"relationFromFields\":[\"gas_station_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fuel_type\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FuelType\",\"relationName\":\"FuelTypeToGasSlip\",\"relationFromFields\":[\"fuel_type_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slip_approvers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasSlipApprover\",\"relationName\":\"GasSlipToGasSlipApprover\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GasSlipApprover\":{\"dbName\":\"gas_slip_approver\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slip_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date_approval\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"gas_slip\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasSlip\",\"relationName\":\"GasSlipToGasSlipApprover\",\"relationFromFields\":[\"gas_slip_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"gas_slip_id\",\"order\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"gas_slip_id\",\"order\"]}],\"isGenerated\":false},\"GasStation\":{\"dbName\":\"gas_station\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contact_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slips\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasSlip\",\"relationName\":\"GasSlipToGasStation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FuelType\":{\"dbName\":\"fuel_type\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gas_slips\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GasSlip\",\"relationName\":\"FuelTypeToGasSlip\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

