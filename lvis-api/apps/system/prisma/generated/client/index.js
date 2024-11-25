
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
} = require('./runtime/library')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.8.1
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.8.1",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
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


  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.DivisionScalarFieldEnum = {
  id: 'id',
  department_id: 'department_id',
  code: 'code',
  name: 'name',
  status: 'status',
  permissions: 'permissions',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  status: 'status',
  permissions: 'permissions',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  department_id: 'department_id',
  division_id: 'division_id',
  firstname: 'firstname',
  middlename: 'middlename',
  lastname: 'lastname',
  signature_src: 'signature_src',
  position: 'position',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ClassificationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  firstname: 'firstname',
  middlename: 'middlename',
  lastname: 'lastname',
  status: 'status',
  role: 'role',
  permissions: 'permissions',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserGroupScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.UserGroupMembersScalarFieldEnum = {
  user_id: 'user_id',
  user_group_id: 'user_group_id'
};

exports.Prisma.UserEmployeeScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  employee_id: 'employee_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserAuditLogScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  event_type: 'event_type',
  event_timestamp: 'event_timestamp',
  ip_address: 'ip_address',
  device_info: 'device_info'
};

exports.Prisma.JOApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RVApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SPRApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MEQSApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.POApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RRApproverSettingScalarFieldEnum = {
  id: 'id',
  label: 'label',
  order: 'order',
  approver_id: 'approver_id',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value'
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
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.UserLogEventType = exports.$Enums.UserLogEventType = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

exports.Prisma.ModelName = {
  Division: 'Division',
  Department: 'Department',
  Account: 'Account',
  Employee: 'Employee',
  Classification: 'Classification',
  User: 'User',
  UserGroup: 'UserGroup',
  UserGroupMembers: 'UserGroupMembers',
  UserEmployee: 'UserEmployee',
  UserAuditLog: 'UserAuditLog',
  JOApproverSetting: 'JOApproverSetting',
  RVApproverSetting: 'RVApproverSetting',
  SPRApproverSetting: 'SPRApproverSetting',
  MEQSApproverSetting: 'MEQSApproverSetting',
  POApproverSetting: 'POApproverSetting',
  RRApproverSetting: 'RRApproverSetting',
  Setting: 'Setting'
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
      "value": "/home/jay/Documents/projects/leyeco/lvis-monorepo/lvis-api/apps/system/prisma/generated/client",
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
    "sourceFilePath": "/home/jay/Documents/projects/leyeco/lvis-monorepo/lvis-api/apps/system/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.8.1",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
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
  "inlineSchema": "Z2VuZXJhdG9yIGNsaWVudCB7CiAgb3V0cHV0ICAgPSAiLi9nZW5lcmF0ZWQvY2xpZW50IgogIHByb3ZpZGVyID0gInByaXNtYS1jbGllbnQtanMiCn0KCmRhdGFzb3VyY2UgZGIgewogIHByb3ZpZGVyID0gInBvc3RncmVzcWwiCiAgdXJsICAgICAgPSBlbnYoIkRBVEFCQVNFX1VSTCIpCn0KCmVudW0gUm9sZSB7CiAgVVNFUgogIEFETUlOCn0KCmVudW0gVXNlckxvZ0V2ZW50VHlwZSB7CiAgTE9HSU4KICBMT0dPVVQKfQoKbW9kZWwgRGl2aXNpb24gewogIGlkICAgICAgICAgICAgU3RyaW5nICAgICBAaWQgQGRlZmF1bHQodXVpZCgpKQogIGRlcGFydG1lbnRfaWQgU3RyaW5nCiAgZGVwYXJ0bWVudCAgICBEZXBhcnRtZW50IEByZWxhdGlvbihmaWVsZHM6IFtkZXBhcnRtZW50X2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQogIGNvZGUgICAgICAgICAgU3RyaW5nICAgICBAdW5pcXVlCiAgbmFtZSAgICAgICAgICBTdHJpbmcKICBzdGF0dXMgICAgICAgIEludCAgICAgICAgQGRlZmF1bHQoMSkKICBwZXJtaXNzaW9ucyBKc29uPwoKCiAgY3JlYXRlZF9ieSBTdHJpbmcKICB1cGRhdGVkX2J5IFN0cmluZz8KCiAgY3JlYXRlZF9hdCBEYXRlVGltZSAgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZF9hdCBEYXRlVGltZSAgQHVwZGF0ZWRBdAoKICBFbXBsb3llZSBFbXBsb3llZVtdCgogIEBAbWFwKCJkaXZpc2lvbiIpCn0KCm1vZGVsIERlcGFydG1lbnQgewogIGlkICAgICBTdHJpbmcgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICBjb2RlICAgU3RyaW5nIEB1bmlxdWUKICBuYW1lICAgU3RyaW5nCiAgc3RhdHVzIEludCAgICBAZGVmYXVsdCgxKQogIHBlcm1pc3Npb25zIEpzb24/CgogIGNyZWF0ZWRfYnkgU3RyaW5nCiAgdXBkYXRlZF9ieSBTdHJpbmc/CgogIGNyZWF0ZWRfYXQgRGF0ZVRpbWUgIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRfYXQgRGF0ZVRpbWUgIEB1cGRhdGVkQXQKCiAgZGl2aXNpb25zIERpdmlzaW9uW10KCiAgQEBtYXAoImRlcGFydG1lbnQiKQogIEVtcGxveWVlIEVtcGxveWVlW10KfQoKbW9kZWwgQWNjb3VudCB7CiAgaWQgICAgICAgICAgU3RyaW5nIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgY29kZSAgICAgICAgU3RyaW5nIEB1bmlxdWUKICBuYW1lICAgICAgICBTdHJpbmcKICBkZXNjcmlwdGlvbiBTdHJpbmcKCiAgY3JlYXRlZF9ieSBTdHJpbmcKICB1cGRhdGVkX2J5IFN0cmluZz8KCiAgY3JlYXRlZF9hdCBEYXRlVGltZSAgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZF9hdCBEYXRlVGltZSAgQHVwZGF0ZWRBdAoKICBAQG1hcCgiYWNjb3VudCIpCn0KCm1vZGVsIEVtcGxveWVlIHsKICBpZCAgICAgICAgIFN0cmluZyAgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICBkZXBhcnRtZW50X2lkIFN0cmluZwogIGRpdmlzaW9uX2lkIFN0cmluZz8KICBmaXJzdG5hbWUgIFN0cmluZyAKICBtaWRkbGVuYW1lIFN0cmluZz8KICBsYXN0bmFtZSAgIFN0cmluZwogIHNpZ25hdHVyZV9zcmMgU3RyaW5nPwogIHBvc2l0aW9uIFN0cmluZyBAZGVmYXVsdCgiVEJBIikKCiAgam9fYXBwcm92ZXJfc2V0dGluZyAgIEpPQXBwcm92ZXJTZXR0aW5nPyAgIEByZWxhdGlvbigiSk9BcHByb3ZlclNldHRpbmciKQogIG1lcXNfYXBwcm92ZXJfc2V0dGluZyBNRVFTQXBwcm92ZXJTZXR0aW5nPyBAcmVsYXRpb24oIk1FUVNBcHByb3ZlclNldHRpbmciKQogIHBvX2FwcHJvdmVyX3NldHRpbmcgICBQT0FwcHJvdmVyU2V0dGluZz8gICBAcmVsYXRpb24oIlBPQXBwcm92ZXJTZXR0aW5nIikKICBydl9hcHByb3Zlcl9zZXR0aW5nICAgUlZBcHByb3ZlclNldHRpbmc/ICAgQHJlbGF0aW9uKCJSVkFwcHJvdmVyU2V0dGluZyIpCiAgc3ByX2FwcHJvdmVyX3NldHRpbmcgIFNQUkFwcHJvdmVyU2V0dGluZz8gIEByZWxhdGlvbigiU1BSQXBwcm92ZXJTZXR0aW5nIikKICBycl9hcHByb3Zlcl9zZXR0aW5nICAgUlJBcHByb3ZlclNldHRpbmc/ICAgQHJlbGF0aW9uKCJSUkFwcHJvdmVyU2V0dGluZyIpCgogIGRlcGFydG1lbnQgRGVwYXJ0bWVudCBAcmVsYXRpb24oZmllbGRzOiBbZGVwYXJ0bWVudF9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBSZXN0cmljdCkKICBkaXZpc2lvbiBEaXZpc2lvbj8gQHJlbGF0aW9uKGZpZWxkczogW2RpdmlzaW9uX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lICBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lICBAdXBkYXRlZEF0CgogIHVzZXJfZW1wbG95ZWUgVXNlckVtcGxveWVlPwoKCiAgQEBpbmRleChbZmlyc3RuYW1lLCBsYXN0bmFtZV0pCgogIEBAbWFwKCJlbXBsb3llZSIpCn0KCm1vZGVsIENsYXNzaWZpY2F0aW9uIHsKICBpZCAgIFN0cmluZyBAaWQgQGRlZmF1bHQodXVpZCgpKQogIG5hbWUgU3RyaW5nCgogIGNyZWF0ZWRfYnkgU3RyaW5nCiAgdXBkYXRlZF9ieSBTdHJpbmc/CgogIGNyZWF0ZWRfYXQgRGF0ZVRpbWUgIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRfYXQgRGF0ZVRpbWUgIEB1cGRhdGVkQXQKCiAgQEBtYXAoImNsYXNzaWZpY2F0aW9uIikKfQoKbW9kZWwgVXNlciB7CiAgaWQgICAgICAgICAgU3RyaW5nICBAaWQgQGRlZmF1bHQodXVpZCgpKQogIHVzZXJuYW1lICAgIFN0cmluZyAgQHVuaXF1ZQogIHBhc3N3b3JkICAgIFN0cmluZwogIGZpcnN0bmFtZSAgIFN0cmluZyAgQGRlZmF1bHQoIiIpCiAgbWlkZGxlbmFtZSAgU3RyaW5nPwogIGxhc3RuYW1lICAgIFN0cmluZyAgQGRlZmF1bHQoIiIpCiAgc3RhdHVzICAgICAgSW50ICAgICBAZGVmYXVsdCgxKQogIHJvbGUgICAgICAgIFJvbGUgICAgQGRlZmF1bHQoVVNFUikKICBwZXJtaXNzaW9ucyBKc29uPwoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lICBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lICBAdXBkYXRlZEF0CgogIC8vIHVzZXJfcGVybWlzc2lvbnMgVXNlclBlcm1pc3Npb25bXQogIHVzZXJfZW1wbG95ZWUgVXNlckVtcGxveWVlPwogIGdyb3VwcyAgICAgIFVzZXJHcm91cE1lbWJlcnNbXSAgCgogIEBAbWFwKCJ1c2VyIikKICB1c2VyX2F1ZGl0X2xvZ3MgVXNlckF1ZGl0TG9nW10KfQoKbW9kZWwgVXNlckdyb3VwIHsKICBpZCAgICAgICAgICBJbnQgICAgICAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkgIAogIG5hbWUgICAgICAgIFN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICBtZW1iZXJzICAgICBVc2VyR3JvdXBNZW1iZXJzW10gICAKCiAgQEBtYXAoInVzZXJfZ3JvdXAiKQp9Cgptb2RlbCBVc2VyR3JvdXBNZW1iZXJzIHsKICB1c2VyX2lkICAgICBTdHJpbmcgICAgICAgICAKICB1c2VyX2dyb3VwX2lkICAgIEludCAgICAgICAgIAoKICB1c2VyICAgICAgIFVzZXIgICAgICAgIEByZWxhdGlvbihmaWVsZHM6IFt1c2VyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpCiAgdXNlcl9ncm91cCAgICAgIFVzZXJHcm91cCAgIEByZWxhdGlvbihmaWVsZHM6IFt1c2VyX2dyb3VwX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpCgogIEBAaWQoW3VzZXJfaWQsIHVzZXJfZ3JvdXBfaWRdKQoKICBAQG1hcCgidXNlcl9ncm91cF9tZW1iZXIiKQp9Cgptb2RlbCBVc2VyRW1wbG95ZWUgewogIGlkICAgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgdXNlcl9pZCAgICAgU3RyaW5nICAgQHVuaXF1ZQogIHVzZXIgICAgICAgIFVzZXIgICAgIEByZWxhdGlvbihmaWVsZHM6IFt1c2VyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IENhc2NhZGUpCiAgZW1wbG95ZWVfaWQgU3RyaW5nICAgQHVuaXF1ZQogIGVtcGxveWVlICAgIEVtcGxveWVlIEByZWxhdGlvbihmaWVsZHM6IFtlbXBsb3llZV9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRfYXQgRGF0ZVRpbWUgQHVwZGF0ZWRBdAoKICBAQG1hcCgidXNlcl9lbXBsb3llZSIpCn0KCm1vZGVsIFVzZXJBdWRpdExvZyB7CiAgaWQgICAgICAgICAgICAgSW50ICAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICB1c2VyX2lkICAgICAgICAgU3RyaW5nCiAgZXZlbnRfdHlwZSAgICAgIFVzZXJMb2dFdmVudFR5cGUKICBldmVudF90aW1lc3RhbXAgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpCiAgaXBfYWRkcmVzcyAgICAgIFN0cmluZwogIGRldmljZV9pbmZvICAgICBKc29uPwoKICB1c2VyICAgICAgICAgICBVc2VyICAgICBAcmVsYXRpb24oZmllbGRzOiBbdXNlcl9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKQoKICBAQG1hcCgidXNlcl9hdWRpdF9sb2ciKQogIEBAaW5kZXgoW3VzZXJfaWRdKQp9Cgptb2RlbCBKT0FwcHJvdmVyU2V0dGluZyB7CiAgaWQgICAgICAgICAgU3RyaW5nIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgbGFiZWwgICAgICAgU3RyaW5nCiAgb3JkZXIgICAgICAgSW50ICAgIEB1bmlxdWUKICBhcHByb3Zlcl9pZCBTdHJpbmcgQHVuaXF1ZQoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRfYXQgRGF0ZVRpbWUgQHVwZGF0ZWRBdAoKICBhcHByb3ZlciBFbXBsb3llZSBAcmVsYXRpb24oIkpPQXBwcm92ZXJTZXR0aW5nIiwgZmllbGRzOiBbYXBwcm92ZXJfaWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogUmVzdHJpY3QpCgogIEBAbWFwKCJqb19hcHByb3Zlcl9zZXR0aW5nIikKfQoKbW9kZWwgUlZBcHByb3ZlclNldHRpbmcgewogIGlkICAgICAgICAgIFN0cmluZyBAaWQgQGRlZmF1bHQodXVpZCgpKQogIGxhYmVsICAgICAgIFN0cmluZwogIG9yZGVyICAgICAgIEludCAgICBAdW5pcXVlCiAgYXBwcm92ZXJfaWQgU3RyaW5nIEB1bmlxdWUKCiAgY3JlYXRlZF9ieSBTdHJpbmcKICB1cGRhdGVkX2J5IFN0cmluZz8KCiAgY3JlYXRlZF9hdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lIEB1cGRhdGVkQXQKCiAgYXBwcm92ZXIgRW1wbG95ZWUgQHJlbGF0aW9uKCJSVkFwcHJvdmVyU2V0dGluZyIsIGZpZWxkczogW2FwcHJvdmVyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQoKICBAQG1hcCgicnZfYXBwcm92ZXJfc2V0dGluZyIpCn0KCm1vZGVsIFNQUkFwcHJvdmVyU2V0dGluZyB7CiAgaWQgICAgICAgICAgU3RyaW5nIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgbGFiZWwgICAgICAgU3RyaW5nCiAgb3JkZXIgICAgICAgSW50ICAgIEB1bmlxdWUKICBhcHByb3Zlcl9pZCBTdHJpbmcgQHVuaXF1ZQoKICBjcmVhdGVkX2J5IFN0cmluZwogIHVwZGF0ZWRfYnkgU3RyaW5nPwoKICBjcmVhdGVkX2F0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRfYXQgRGF0ZVRpbWUgQHVwZGF0ZWRBdAoKICBhcHByb3ZlciBFbXBsb3llZSBAcmVsYXRpb24oIlNQUkFwcHJvdmVyU2V0dGluZyIsIGZpZWxkczogW2FwcHJvdmVyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQoKICBAQG1hcCgic3ByX2FwcHJvdmVyX3NldHRpbmciKQp9Cgptb2RlbCBNRVFTQXBwcm92ZXJTZXR0aW5nIHsKICBpZCAgICAgICAgICBTdHJpbmcgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICBsYWJlbCAgICAgICBTdHJpbmcKICBvcmRlciAgICAgICBJbnQgICAgQHVuaXF1ZQogIGFwcHJvdmVyX2lkIFN0cmluZyBAdW5pcXVlCgogIGNyZWF0ZWRfYnkgU3RyaW5nCiAgdXBkYXRlZF9ieSBTdHJpbmc/CgogIGNyZWF0ZWRfYXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZF9hdCBEYXRlVGltZSBAdXBkYXRlZEF0CgogIGFwcHJvdmVyIEVtcGxveWVlIEByZWxhdGlvbigiTUVRU0FwcHJvdmVyU2V0dGluZyIsIGZpZWxkczogW2FwcHJvdmVyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQoKICBAQG1hcCgibWVxc19hcHByb3Zlcl9zZXR0aW5nIikKfQoKbW9kZWwgUE9BcHByb3ZlclNldHRpbmcgewogIGlkICAgICAgICAgIFN0cmluZyBAaWQgQGRlZmF1bHQodXVpZCgpKQogIGxhYmVsICAgICAgIFN0cmluZwogIG9yZGVyICAgICAgIEludCAgICBAdW5pcXVlCiAgYXBwcm92ZXJfaWQgU3RyaW5nIEB1bmlxdWUKCiAgY3JlYXRlZF9ieSBTdHJpbmcKICB1cGRhdGVkX2J5IFN0cmluZz8KCiAgY3JlYXRlZF9hdCBEYXRlVGltZSBAZGVmYXVsdChub3coKSkKICB1cGRhdGVkX2F0IERhdGVUaW1lIEB1cGRhdGVkQXQKCiAgYXBwcm92ZXIgRW1wbG95ZWUgQHJlbGF0aW9uKCJQT0FwcHJvdmVyU2V0dGluZyIsIGZpZWxkczogW2FwcHJvdmVyX2lkXSwgcmVmZXJlbmNlczogW2lkXSwgb25EZWxldGU6IFJlc3RyaWN0KQoKICBAQG1hcCgicG9fYXBwcm92ZXJfc2V0dGluZyIpCn0KCm1vZGVsIFJSQXBwcm92ZXJTZXR0aW5nIHsKICBpZCAgICAgICAgICBTdHJpbmcgQGlkIEBkZWZhdWx0KHV1aWQoKSkKICBsYWJlbCAgICAgICBTdHJpbmcKICBvcmRlciAgICAgICBJbnQgICAgQHVuaXF1ZQogIGFwcHJvdmVyX2lkIFN0cmluZyBAdW5pcXVlCgogIGNyZWF0ZWRfYnkgU3RyaW5nCiAgdXBkYXRlZF9ieSBTdHJpbmc/CgogIGNyZWF0ZWRfYXQgRGF0ZVRpbWUgQGRlZmF1bHQobm93KCkpCiAgdXBkYXRlZF9hdCBEYXRlVGltZSBAdXBkYXRlZEF0CgogIGFwcHJvdmVyIEVtcGxveWVlIEByZWxhdGlvbigiUlJBcHByb3ZlclNldHRpbmciLCBmaWVsZHM6IFthcHByb3Zlcl9pZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBSZXN0cmljdCkKCiAgQEBtYXAoInJyX2FwcHJvdmVyX3NldHRpbmciKQp9Cgptb2RlbCBTZXR0aW5nIHsKICBpZCAgICAgICAgIEludCAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkKICBrZXkgU3RyaW5nIEB1bmlxdWUKICB2YWx1ZSBTdHJpbmcgCgogIEBAbWFwKCJzZXR0aW5nIikKfQ==",
  "inlineSchemaHash": "a2086f362e35e690cbb9f076334c4ef10ba8364e6860b48e63db4e8214a91a7f"
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "prisma/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Division\":{\"dbName\":\"division\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"department_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"department\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Department\",\"relationName\":\"DepartmentToDivision\",\"relationFromFields\":[\"department_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"Employee\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"DivisionToEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Department\":{\"dbName\":\"department\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"divisions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"relationName\":\"DepartmentToDivision\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Employee\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"DepartmentToEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Account\":{\"dbName\":\"account\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Employee\":{\"dbName\":\"employee\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"department_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"middlename\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signature_src\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"position\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"TBA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jo_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JOApproverSetting\",\"relationName\":\"JOApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meqs_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MEQSApproverSetting\",\"relationName\":\"MEQSApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"po_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"POApproverSetting\",\"relationName\":\"POApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rv_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RVApproverSetting\",\"relationName\":\"RVApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"spr_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SPRApproverSetting\",\"relationName\":\"SPRApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rr_approver_setting\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RRApproverSetting\",\"relationName\":\"RRApproverSetting\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"department\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Department\",\"relationName\":\"DepartmentToEmployee\",\"relationFromFields\":[\"department_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"relationName\":\"DivisionToEmployee\",\"relationFromFields\":[\"division_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user_employee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserEmployee\",\"relationName\":\"EmployeeToUserEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Classification\":{\"dbName\":\"classification\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"User\":{\"dbName\":\"user\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"middlename\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Role\",\"default\":\"USER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user_employee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserEmployee\",\"relationName\":\"UserToUserEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groups\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserGroupMembers\",\"relationName\":\"UserToUserGroupMembers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_audit_logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserAuditLog\",\"relationName\":\"UserToUserAuditLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserGroup\":{\"dbName\":\"user_group\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"members\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserGroupMembers\",\"relationName\":\"UserGroupToUserGroupMembers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserGroupMembers\":{\"dbName\":\"user_group_member\",\"fields\":[{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_group_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserGroupMembers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_group\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserGroup\",\"relationName\":\"UserGroupToUserGroupMembers\",\"relationFromFields\":[\"user_group_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"user_id\",\"user_group_id\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserEmployee\":{\"dbName\":\"user_employee\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserEmployee\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employee_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"EmployeeToUserEmployee\",\"relationFromFields\":[\"employee_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserAuditLog\":{\"dbName\":\"user_audit_log\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserLogEventType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event_timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device_info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserAuditLog\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JOApproverSetting\":{\"dbName\":\"jo_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"JOApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RVApproverSetting\":{\"dbName\":\"rv_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"RVApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SPRApproverSetting\":{\"dbName\":\"spr_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"SPRApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MEQSApproverSetting\":{\"dbName\":\"meqs_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"MEQSApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"POApproverSetting\":{\"dbName\":\"po_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"POApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RRApproverSetting\":{\"dbName\":\"rr_approver_setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approver_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"approver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"relationName\":\"RRApproverSetting\",\"relationFromFields\":[\"approver_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Setting\":{\"dbName\":\"setting\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"USER\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null}],\"dbName\":null},\"UserLogEventType\":{\"values\":[{\"name\":\"LOGIN\",\"dbName\":null},{\"name\":\"LOGOUT\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.getQueryEngineWasmModule = undefined


const { warnEnvConflicts } = require('./runtime/library')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-debian-openssl-3.0.x.so.node");
path.join(process.cwd(), "prisma/generated/client/libquery_engine-debian-openssl-3.0.x.so.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/client/schema.prisma")
