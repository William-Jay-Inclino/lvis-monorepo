
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Vehicle
 * 
 */
export type Vehicle = $Result.DefaultSelection<Prisma.$VehiclePayload>
/**
 * Model TripTicket
 * 
 */
export type TripTicket = $Result.DefaultSelection<Prisma.$TripTicketPayload>
/**
 * Model TripTicketApprover
 * 
 */
export type TripTicketApprover = $Result.DefaultSelection<Prisma.$TripTicketApproverPayload>
/**
 * Model GasSlip
 * 
 */
export type GasSlip = $Result.DefaultSelection<Prisma.$GasSlipPayload>
/**
 * Model GasSlipApprover
 * 
 */
export type GasSlipApprover = $Result.DefaultSelection<Prisma.$GasSlipApproverPayload>
/**
 * Model GasStation
 * 
 */
export type GasStation = $Result.DefaultSelection<Prisma.$GasStationPayload>
/**
 * Model FuelType
 * 
 */
export type FuelType = $Result.DefaultSelection<Prisma.$FuelTypePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Vehicles
 * const vehicles = await prisma.vehicle.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Vehicles
   * const vehicles = await prisma.vehicle.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.vehicle`: Exposes CRUD operations for the **Vehicle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicles
    * const vehicles = await prisma.vehicle.findMany()
    * ```
    */
  get vehicle(): Prisma.VehicleDelegate<ExtArgs>;

  /**
   * `prisma.tripTicket`: Exposes CRUD operations for the **TripTicket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TripTickets
    * const tripTickets = await prisma.tripTicket.findMany()
    * ```
    */
  get tripTicket(): Prisma.TripTicketDelegate<ExtArgs>;

  /**
   * `prisma.tripTicketApprover`: Exposes CRUD operations for the **TripTicketApprover** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TripTicketApprovers
    * const tripTicketApprovers = await prisma.tripTicketApprover.findMany()
    * ```
    */
  get tripTicketApprover(): Prisma.TripTicketApproverDelegate<ExtArgs>;

  /**
   * `prisma.gasSlip`: Exposes CRUD operations for the **GasSlip** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GasSlips
    * const gasSlips = await prisma.gasSlip.findMany()
    * ```
    */
  get gasSlip(): Prisma.GasSlipDelegate<ExtArgs>;

  /**
   * `prisma.gasSlipApprover`: Exposes CRUD operations for the **GasSlipApprover** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GasSlipApprovers
    * const gasSlipApprovers = await prisma.gasSlipApprover.findMany()
    * ```
    */
  get gasSlipApprover(): Prisma.GasSlipApproverDelegate<ExtArgs>;

  /**
   * `prisma.gasStation`: Exposes CRUD operations for the **GasStation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GasStations
    * const gasStations = await prisma.gasStation.findMany()
    * ```
    */
  get gasStation(): Prisma.GasStationDelegate<ExtArgs>;

  /**
   * `prisma.fuelType`: Exposes CRUD operations for the **FuelType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FuelTypes
    * const fuelTypes = await prisma.fuelType.findMany()
    * ```
    */
  get fuelType(): Prisma.FuelTypeDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.8.1
   * Query Engine version: bf0e5e8a04cada8225617067eaa03d041e2bba36
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Vehicle: 'Vehicle',
    TripTicket: 'TripTicket',
    TripTicketApprover: 'TripTicketApprover',
    GasSlip: 'GasSlip',
    GasSlipApprover: 'GasSlipApprover',
    GasStation: 'GasStation',
    FuelType: 'FuelType'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'vehicle' | 'tripTicket' | 'tripTicketApprover' | 'gasSlip' | 'gasSlipApprover' | 'gasStation' | 'fuelType'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      Vehicle: {
        payload: Prisma.$VehiclePayload<ExtArgs>
        fields: Prisma.VehicleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findFirst: {
            args: Prisma.VehicleFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findMany: {
            args: Prisma.VehicleFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          create: {
            args: Prisma.VehicleCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          createMany: {
            args: Prisma.VehicleCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.VehicleDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          update: {
            args: Prisma.VehicleUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          deleteMany: {
            args: Prisma.VehicleDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.VehicleUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          aggregate: {
            args: Prisma.VehicleAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateVehicle>
          }
          groupBy: {
            args: Prisma.VehicleGroupByArgs<ExtArgs>,
            result: $Utils.Optional<VehicleGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleCountArgs<ExtArgs>,
            result: $Utils.Optional<VehicleCountAggregateOutputType> | number
          }
        }
      }
      TripTicket: {
        payload: Prisma.$TripTicketPayload<ExtArgs>
        fields: Prisma.TripTicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TripTicketFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TripTicketFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          findFirst: {
            args: Prisma.TripTicketFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TripTicketFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          findMany: {
            args: Prisma.TripTicketFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>[]
          }
          create: {
            args: Prisma.TripTicketCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          createMany: {
            args: Prisma.TripTicketCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TripTicketDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          update: {
            args: Prisma.TripTicketUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          deleteMany: {
            args: Prisma.TripTicketDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TripTicketUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TripTicketUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketPayload>
          }
          aggregate: {
            args: Prisma.TripTicketAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTripTicket>
          }
          groupBy: {
            args: Prisma.TripTicketGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TripTicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TripTicketCountArgs<ExtArgs>,
            result: $Utils.Optional<TripTicketCountAggregateOutputType> | number
          }
        }
      }
      TripTicketApprover: {
        payload: Prisma.$TripTicketApproverPayload<ExtArgs>
        fields: Prisma.TripTicketApproverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TripTicketApproverFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TripTicketApproverFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          findFirst: {
            args: Prisma.TripTicketApproverFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TripTicketApproverFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          findMany: {
            args: Prisma.TripTicketApproverFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>[]
          }
          create: {
            args: Prisma.TripTicketApproverCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          createMany: {
            args: Prisma.TripTicketApproverCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TripTicketApproverDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          update: {
            args: Prisma.TripTicketApproverUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          deleteMany: {
            args: Prisma.TripTicketApproverDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TripTicketApproverUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TripTicketApproverUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TripTicketApproverPayload>
          }
          aggregate: {
            args: Prisma.TripTicketApproverAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTripTicketApprover>
          }
          groupBy: {
            args: Prisma.TripTicketApproverGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TripTicketApproverGroupByOutputType>[]
          }
          count: {
            args: Prisma.TripTicketApproverCountArgs<ExtArgs>,
            result: $Utils.Optional<TripTicketApproverCountAggregateOutputType> | number
          }
        }
      }
      GasSlip: {
        payload: Prisma.$GasSlipPayload<ExtArgs>
        fields: Prisma.GasSlipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GasSlipFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GasSlipFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          findFirst: {
            args: Prisma.GasSlipFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GasSlipFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          findMany: {
            args: Prisma.GasSlipFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>[]
          }
          create: {
            args: Prisma.GasSlipCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          createMany: {
            args: Prisma.GasSlipCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.GasSlipDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          update: {
            args: Prisma.GasSlipUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          deleteMany: {
            args: Prisma.GasSlipDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.GasSlipUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.GasSlipUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipPayload>
          }
          aggregate: {
            args: Prisma.GasSlipAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGasSlip>
          }
          groupBy: {
            args: Prisma.GasSlipGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GasSlipGroupByOutputType>[]
          }
          count: {
            args: Prisma.GasSlipCountArgs<ExtArgs>,
            result: $Utils.Optional<GasSlipCountAggregateOutputType> | number
          }
        }
      }
      GasSlipApprover: {
        payload: Prisma.$GasSlipApproverPayload<ExtArgs>
        fields: Prisma.GasSlipApproverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GasSlipApproverFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GasSlipApproverFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          findFirst: {
            args: Prisma.GasSlipApproverFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GasSlipApproverFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          findMany: {
            args: Prisma.GasSlipApproverFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>[]
          }
          create: {
            args: Prisma.GasSlipApproverCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          createMany: {
            args: Prisma.GasSlipApproverCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.GasSlipApproverDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          update: {
            args: Prisma.GasSlipApproverUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          deleteMany: {
            args: Prisma.GasSlipApproverDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.GasSlipApproverUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.GasSlipApproverUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasSlipApproverPayload>
          }
          aggregate: {
            args: Prisma.GasSlipApproverAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGasSlipApprover>
          }
          groupBy: {
            args: Prisma.GasSlipApproverGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GasSlipApproverGroupByOutputType>[]
          }
          count: {
            args: Prisma.GasSlipApproverCountArgs<ExtArgs>,
            result: $Utils.Optional<GasSlipApproverCountAggregateOutputType> | number
          }
        }
      }
      GasStation: {
        payload: Prisma.$GasStationPayload<ExtArgs>
        fields: Prisma.GasStationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GasStationFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GasStationFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          findFirst: {
            args: Prisma.GasStationFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GasStationFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          findMany: {
            args: Prisma.GasStationFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>[]
          }
          create: {
            args: Prisma.GasStationCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          createMany: {
            args: Prisma.GasStationCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.GasStationDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          update: {
            args: Prisma.GasStationUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          deleteMany: {
            args: Prisma.GasStationDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.GasStationUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.GasStationUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$GasStationPayload>
          }
          aggregate: {
            args: Prisma.GasStationAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGasStation>
          }
          groupBy: {
            args: Prisma.GasStationGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GasStationGroupByOutputType>[]
          }
          count: {
            args: Prisma.GasStationCountArgs<ExtArgs>,
            result: $Utils.Optional<GasStationCountAggregateOutputType> | number
          }
        }
      }
      FuelType: {
        payload: Prisma.$FuelTypePayload<ExtArgs>
        fields: Prisma.FuelTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FuelTypeFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FuelTypeFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          findFirst: {
            args: Prisma.FuelTypeFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FuelTypeFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          findMany: {
            args: Prisma.FuelTypeFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>[]
          }
          create: {
            args: Prisma.FuelTypeCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          createMany: {
            args: Prisma.FuelTypeCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FuelTypeDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          update: {
            args: Prisma.FuelTypeUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          deleteMany: {
            args: Prisma.FuelTypeDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FuelTypeUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FuelTypeUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FuelTypePayload>
          }
          aggregate: {
            args: Prisma.FuelTypeAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFuelType>
          }
          groupBy: {
            args: Prisma.FuelTypeGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FuelTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.FuelTypeCountArgs<ExtArgs>,
            result: $Utils.Optional<FuelTypeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type VehicleCountOutputType
   */

  export type VehicleCountOutputType = {
    trip_tickets: number
    gas_slips: number
  }

  export type VehicleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trip_tickets?: boolean | VehicleCountOutputTypeCountTrip_ticketsArgs
    gas_slips?: boolean | VehicleCountOutputTypeCountGas_slipsArgs
  }

  // Custom InputTypes

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCountOutputType
     */
    select?: VehicleCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountTrip_ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TripTicketWhereInput
  }


  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountGas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipWhereInput
  }



  /**
   * Count Type TripTicketCountOutputType
   */

  export type TripTicketCountOutputType = {
    trip_ticket_approvers: number
  }

  export type TripTicketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trip_ticket_approvers?: boolean | TripTicketCountOutputTypeCountTrip_ticket_approversArgs
  }

  // Custom InputTypes

  /**
   * TripTicketCountOutputType without action
   */
  export type TripTicketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketCountOutputType
     */
    select?: TripTicketCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * TripTicketCountOutputType without action
   */
  export type TripTicketCountOutputTypeCountTrip_ticket_approversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TripTicketApproverWhereInput
  }



  /**
   * Count Type GasSlipCountOutputType
   */

  export type GasSlipCountOutputType = {
    gas_slip_approvers: number
  }

  export type GasSlipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slip_approvers?: boolean | GasSlipCountOutputTypeCountGas_slip_approversArgs
  }

  // Custom InputTypes

  /**
   * GasSlipCountOutputType without action
   */
  export type GasSlipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipCountOutputType
     */
    select?: GasSlipCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * GasSlipCountOutputType without action
   */
  export type GasSlipCountOutputTypeCountGas_slip_approversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipApproverWhereInput
  }



  /**
   * Count Type GasStationCountOutputType
   */

  export type GasStationCountOutputType = {
    gas_slips: number
  }

  export type GasStationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slips?: boolean | GasStationCountOutputTypeCountGas_slipsArgs
  }

  // Custom InputTypes

  /**
   * GasStationCountOutputType without action
   */
  export type GasStationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStationCountOutputType
     */
    select?: GasStationCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * GasStationCountOutputType without action
   */
  export type GasStationCountOutputTypeCountGas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipWhereInput
  }



  /**
   * Count Type FuelTypeCountOutputType
   */

  export type FuelTypeCountOutputType = {
    gas_slips: number
  }

  export type FuelTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slips?: boolean | FuelTypeCountOutputTypeCountGas_slipsArgs
  }

  // Custom InputTypes

  /**
   * FuelTypeCountOutputType without action
   */
  export type FuelTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelTypeCountOutputType
     */
    select?: FuelTypeCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * FuelTypeCountOutputType without action
   */
  export type FuelTypeCountOutputTypeCountGas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipWhereInput
  }



  /**
   * Models
   */

  /**
   * Model Vehicle
   */

  export type AggregateVehicle = {
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  export type VehicleAvgAggregateOutputType = {
    classification_id: number | null
    status: number | null
  }

  export type VehicleSumAggregateOutputType = {
    classification_id: number | null
    status: number | null
  }

  export type VehicleMinAggregateOutputType = {
    id: string | null
    vehicle_number: string | null
    plate_number: string | null
    rf_id: string | null
    classification_id: number | null
    assignee_id: string | null
    name: string | null
    date_acquired: Date | null
    status: number | null
    created_by: string | null
    updated_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type VehicleMaxAggregateOutputType = {
    id: string | null
    vehicle_number: string | null
    plate_number: string | null
    rf_id: string | null
    classification_id: number | null
    assignee_id: string | null
    name: string | null
    date_acquired: Date | null
    status: number | null
    created_by: string | null
    updated_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type VehicleCountAggregateOutputType = {
    id: number
    vehicle_number: number
    plate_number: number
    rf_id: number
    classification_id: number
    assignee_id: number
    name: number
    date_acquired: number
    status: number
    created_by: number
    updated_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type VehicleAvgAggregateInputType = {
    classification_id?: true
    status?: true
  }

  export type VehicleSumAggregateInputType = {
    classification_id?: true
    status?: true
  }

  export type VehicleMinAggregateInputType = {
    id?: true
    vehicle_number?: true
    plate_number?: true
    rf_id?: true
    classification_id?: true
    assignee_id?: true
    name?: true
    date_acquired?: true
    status?: true
    created_by?: true
    updated_by?: true
    created_at?: true
    updated_at?: true
  }

  export type VehicleMaxAggregateInputType = {
    id?: true
    vehicle_number?: true
    plate_number?: true
    rf_id?: true
    classification_id?: true
    assignee_id?: true
    name?: true
    date_acquired?: true
    status?: true
    created_by?: true
    updated_by?: true
    created_at?: true
    updated_at?: true
  }

  export type VehicleCountAggregateInputType = {
    id?: true
    vehicle_number?: true
    plate_number?: true
    rf_id?: true
    classification_id?: true
    assignee_id?: true
    name?: true
    date_acquired?: true
    status?: true
    created_by?: true
    updated_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type VehicleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicle to aggregate.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vehicles
    **/
    _count?: true | VehicleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehicleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehicleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleMaxAggregateInputType
  }

  export type GetVehicleAggregateType<T extends VehicleAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle[P]>
      : GetScalarType<T[P], AggregateVehicle[P]>
  }




  export type VehicleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleWhereInput
    orderBy?: VehicleOrderByWithAggregationInput | VehicleOrderByWithAggregationInput[]
    by: VehicleScalarFieldEnum[] | VehicleScalarFieldEnum
    having?: VehicleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleCountAggregateInputType | true
    _avg?: VehicleAvgAggregateInputType
    _sum?: VehicleSumAggregateInputType
    _min?: VehicleMinAggregateInputType
    _max?: VehicleMaxAggregateInputType
  }

  export type VehicleGroupByOutputType = {
    id: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date
    status: number
    created_by: string
    updated_by: string | null
    created_at: Date
    updated_at: Date
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  type GetVehicleGroupByPayload<T extends VehicleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleGroupByOutputType[P]>
        }
      >
    >


  export type VehicleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_number?: boolean
    plate_number?: boolean
    rf_id?: boolean
    classification_id?: boolean
    assignee_id?: boolean
    name?: boolean
    date_acquired?: boolean
    status?: boolean
    created_by?: boolean
    updated_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    trip_tickets?: boolean | Vehicle$trip_ticketsArgs<ExtArgs>
    gas_slips?: boolean | Vehicle$gas_slipsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectScalar = {
    id?: boolean
    vehicle_number?: boolean
    plate_number?: boolean
    rf_id?: boolean
    classification_id?: boolean
    assignee_id?: boolean
    name?: boolean
    date_acquired?: boolean
    status?: boolean
    created_by?: boolean
    updated_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type VehicleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trip_tickets?: boolean | Vehicle$trip_ticketsArgs<ExtArgs>
    gas_slips?: boolean | Vehicle$gas_slipsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $VehiclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vehicle"
    objects: {
      trip_tickets: Prisma.$TripTicketPayload<ExtArgs>[]
      gas_slips: Prisma.$GasSlipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicle_number: string
      plate_number: string
      rf_id: string
      classification_id: number
      assignee_id: string
      name: string
      date_acquired: Date
      status: number
      created_by: string
      updated_by: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["vehicle"]>
    composites: {}
  }


  type VehicleGetPayload<S extends boolean | null | undefined | VehicleDefaultArgs> = $Result.GetResult<Prisma.$VehiclePayload, S>

  type VehicleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VehicleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VehicleCountAggregateInputType | true
    }

  export interface VehicleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vehicle'], meta: { name: 'Vehicle' } }
    /**
     * Find zero or one Vehicle that matches the filter.
     * @param {VehicleFindUniqueArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends VehicleFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleFindUniqueArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Vehicle that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {VehicleFindUniqueOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends VehicleFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Vehicle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends VehicleFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleFindFirstArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Vehicle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends VehicleFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicles
     * const vehicles = await prisma.vehicle.findMany()
     * 
     * // Get first 10 Vehicles
     * const vehicles = await prisma.vehicle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends VehicleFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Vehicle.
     * @param {VehicleCreateArgs} args - Arguments to create a Vehicle.
     * @example
     * // Create one Vehicle
     * const Vehicle = await prisma.vehicle.create({
     *   data: {
     *     // ... data to create a Vehicle
     *   }
     * })
     * 
    **/
    create<T extends VehicleCreateArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleCreateArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Vehicles.
     *     @param {VehicleCreateManyArgs} args - Arguments to create many Vehicles.
     *     @example
     *     // Create many Vehicles
     *     const vehicle = await prisma.vehicle.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends VehicleCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Vehicle.
     * @param {VehicleDeleteArgs} args - Arguments to delete one Vehicle.
     * @example
     * // Delete one Vehicle
     * const Vehicle = await prisma.vehicle.delete({
     *   where: {
     *     // ... filter to delete one Vehicle
     *   }
     * })
     * 
    **/
    delete<T extends VehicleDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleDeleteArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Vehicle.
     * @param {VehicleUpdateArgs} args - Arguments to update one Vehicle.
     * @example
     * // Update one Vehicle
     * const vehicle = await prisma.vehicle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VehicleUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleUpdateArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Vehicles.
     * @param {VehicleDeleteManyArgs} args - Arguments to filter Vehicles to delete.
     * @example
     * // Delete a few Vehicles
     * const { count } = await prisma.vehicle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VehicleDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, VehicleDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VehicleUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vehicle.
     * @param {VehicleUpsertArgs} args - Arguments to update or create a Vehicle.
     * @example
     * // Update or create a Vehicle
     * const vehicle = await prisma.vehicle.upsert({
     *   create: {
     *     // ... data to create a Vehicle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle we want to update
     *   }
     * })
    **/
    upsert<T extends VehicleUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, VehicleUpsertArgs<ExtArgs>>
    ): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleCountArgs} args - Arguments to filter Vehicles to count.
     * @example
     * // Count the number of Vehicles
     * const count = await prisma.vehicle.count({
     *   where: {
     *     // ... the filter for the Vehicles we want to count
     *   }
     * })
    **/
    count<T extends VehicleCountArgs>(
      args?: Subset<T, VehicleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleAggregateArgs>(args: Subset<T, VehicleAggregateArgs>): Prisma.PrismaPromise<GetVehicleAggregateType<T>>

    /**
     * Group by Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleGroupByArgs['orderBy'] }
        : { orderBy?: VehicleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vehicle model
   */
  readonly fields: VehicleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vehicle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    trip_tickets<T extends Vehicle$trip_ticketsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$trip_ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findMany'> | Null>;

    gas_slips<T extends Vehicle$gas_slipsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$gas_slipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Vehicle model
   */ 
  interface VehicleFieldRefs {
    readonly id: FieldRef<"Vehicle", 'String'>
    readonly vehicle_number: FieldRef<"Vehicle", 'String'>
    readonly plate_number: FieldRef<"Vehicle", 'String'>
    readonly rf_id: FieldRef<"Vehicle", 'String'>
    readonly classification_id: FieldRef<"Vehicle", 'Int'>
    readonly assignee_id: FieldRef<"Vehicle", 'String'>
    readonly name: FieldRef<"Vehicle", 'String'>
    readonly date_acquired: FieldRef<"Vehicle", 'DateTime'>
    readonly status: FieldRef<"Vehicle", 'Int'>
    readonly created_by: FieldRef<"Vehicle", 'String'>
    readonly updated_by: FieldRef<"Vehicle", 'String'>
    readonly created_at: FieldRef<"Vehicle", 'DateTime'>
    readonly updated_at: FieldRef<"Vehicle", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * Vehicle findUnique
   */
  export type VehicleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }


  /**
   * Vehicle findUniqueOrThrow
   */
  export type VehicleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }


  /**
   * Vehicle findFirst
   */
  export type VehicleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }


  /**
   * Vehicle findFirstOrThrow
   */
  export type VehicleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }


  /**
   * Vehicle findMany
   */
  export type VehicleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicles to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }


  /**
   * Vehicle create
   */
  export type VehicleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to create a Vehicle.
     */
    data: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
  }


  /**
   * Vehicle createMany
   */
  export type VehicleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * Vehicle update
   */
  export type VehicleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to update a Vehicle.
     */
    data: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
    /**
     * Choose, which Vehicle to update.
     */
    where: VehicleWhereUniqueInput
  }


  /**
   * Vehicle updateMany
   */
  export type VehicleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
  }


  /**
   * Vehicle upsert
   */
  export type VehicleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The filter to search for the Vehicle to update in case it exists.
     */
    where: VehicleWhereUniqueInput
    /**
     * In case the Vehicle found by the `where` argument doesn't exist, create a new Vehicle with this data.
     */
    create: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
    /**
     * In case the Vehicle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
  }


  /**
   * Vehicle delete
   */
  export type VehicleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter which Vehicle to delete.
     */
    where: VehicleWhereUniqueInput
  }


  /**
   * Vehicle deleteMany
   */
  export type VehicleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicles to delete
     */
    where?: VehicleWhereInput
  }


  /**
   * Vehicle.trip_tickets
   */
  export type Vehicle$trip_ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    where?: TripTicketWhereInput
    orderBy?: TripTicketOrderByWithRelationInput | TripTicketOrderByWithRelationInput[]
    cursor?: TripTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TripTicketScalarFieldEnum | TripTicketScalarFieldEnum[]
  }


  /**
   * Vehicle.gas_slips
   */
  export type Vehicle$gas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    where?: GasSlipWhereInput
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    cursor?: GasSlipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * Vehicle without action
   */
  export type VehicleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: VehicleInclude<ExtArgs> | null
  }



  /**
   * Model TripTicket
   */

  export type AggregateTripTicket = {
    _count: TripTicketCountAggregateOutputType | null
    _avg: TripTicketAvgAggregateOutputType | null
    _sum: TripTicketSumAggregateOutputType | null
    _min: TripTicketMinAggregateOutputType | null
    _max: TripTicketMaxAggregateOutputType | null
  }

  export type TripTicketAvgAggregateOutputType = {
    status: number | null
  }

  export type TripTicketSumAggregateOutputType = {
    status: number | null
  }

  export type TripTicketMinAggregateOutputType = {
    id: string | null
    vehicle_id: string | null
    driver_id: string | null
    passengers: string | null
    destination: string | null
    purpose: string | null
    start_time: Date | null
    end_time: Date | null
    actual_start_time: Date | null
    actual_end_time: Date | null
    is_operation: boolean | null
    is_stay_in: boolean | null
    is_personal: boolean | null
    is_out_of_coverage: boolean | null
    prepared_by_id: string | null
    status: number | null
    cancelled_by: string | null
    created_by: string | null
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TripTicketMaxAggregateOutputType = {
    id: string | null
    vehicle_id: string | null
    driver_id: string | null
    passengers: string | null
    destination: string | null
    purpose: string | null
    start_time: Date | null
    end_time: Date | null
    actual_start_time: Date | null
    actual_end_time: Date | null
    is_operation: boolean | null
    is_stay_in: boolean | null
    is_personal: boolean | null
    is_out_of_coverage: boolean | null
    prepared_by_id: string | null
    status: number | null
    cancelled_by: string | null
    created_by: string | null
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TripTicketCountAggregateOutputType = {
    id: number
    vehicle_id: number
    driver_id: number
    passengers: number
    destination: number
    purpose: number
    start_time: number
    end_time: number
    actual_start_time: number
    actual_end_time: number
    is_operation: number
    is_stay_in: number
    is_personal: number
    is_out_of_coverage: number
    prepared_by_id: number
    status: number
    cancelled_by: number
    created_by: number
    updated_by: number
    cancelled_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TripTicketAvgAggregateInputType = {
    status?: true
  }

  export type TripTicketSumAggregateInputType = {
    status?: true
  }

  export type TripTicketMinAggregateInputType = {
    id?: true
    vehicle_id?: true
    driver_id?: true
    passengers?: true
    destination?: true
    purpose?: true
    start_time?: true
    end_time?: true
    actual_start_time?: true
    actual_end_time?: true
    is_operation?: true
    is_stay_in?: true
    is_personal?: true
    is_out_of_coverage?: true
    prepared_by_id?: true
    status?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type TripTicketMaxAggregateInputType = {
    id?: true
    vehicle_id?: true
    driver_id?: true
    passengers?: true
    destination?: true
    purpose?: true
    start_time?: true
    end_time?: true
    actual_start_time?: true
    actual_end_time?: true
    is_operation?: true
    is_stay_in?: true
    is_personal?: true
    is_out_of_coverage?: true
    prepared_by_id?: true
    status?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type TripTicketCountAggregateInputType = {
    id?: true
    vehicle_id?: true
    driver_id?: true
    passengers?: true
    destination?: true
    purpose?: true
    start_time?: true
    end_time?: true
    actual_start_time?: true
    actual_end_time?: true
    is_operation?: true
    is_stay_in?: true
    is_personal?: true
    is_out_of_coverage?: true
    prepared_by_id?: true
    status?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TripTicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TripTicket to aggregate.
     */
    where?: TripTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTickets to fetch.
     */
    orderBy?: TripTicketOrderByWithRelationInput | TripTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TripTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TripTickets
    **/
    _count?: true | TripTicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TripTicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TripTicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TripTicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TripTicketMaxAggregateInputType
  }

  export type GetTripTicketAggregateType<T extends TripTicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTripTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTripTicket[P]>
      : GetScalarType<T[P], AggregateTripTicket[P]>
  }




  export type TripTicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TripTicketWhereInput
    orderBy?: TripTicketOrderByWithAggregationInput | TripTicketOrderByWithAggregationInput[]
    by: TripTicketScalarFieldEnum[] | TripTicketScalarFieldEnum
    having?: TripTicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TripTicketCountAggregateInputType | true
    _avg?: TripTicketAvgAggregateInputType
    _sum?: TripTicketSumAggregateInputType
    _min?: TripTicketMinAggregateInputType
    _max?: TripTicketMaxAggregateInputType
  }

  export type TripTicketGroupByOutputType = {
    id: string
    vehicle_id: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date
    end_time: Date
    actual_start_time: Date | null
    actual_end_time: Date | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by: string | null
    created_by: string
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date
    updated_at: Date
    _count: TripTicketCountAggregateOutputType | null
    _avg: TripTicketAvgAggregateOutputType | null
    _sum: TripTicketSumAggregateOutputType | null
    _min: TripTicketMinAggregateOutputType | null
    _max: TripTicketMaxAggregateOutputType | null
  }

  type GetTripTicketGroupByPayload<T extends TripTicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TripTicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TripTicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TripTicketGroupByOutputType[P]>
            : GetScalarType<T[P], TripTicketGroupByOutputType[P]>
        }
      >
    >


  export type TripTicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    driver_id?: boolean
    passengers?: boolean
    destination?: boolean
    purpose?: boolean
    start_time?: boolean
    end_time?: boolean
    actual_start_time?: boolean
    actual_end_time?: boolean
    is_operation?: boolean
    is_stay_in?: boolean
    is_personal?: boolean
    is_out_of_coverage?: boolean
    prepared_by_id?: boolean
    status?: boolean
    cancelled_by?: boolean
    created_by?: boolean
    updated_by?: boolean
    cancelled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
    trip_ticket_approvers?: boolean | TripTicket$trip_ticket_approversArgs<ExtArgs>
    _count?: boolean | TripTicketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tripTicket"]>

  export type TripTicketSelectScalar = {
    id?: boolean
    vehicle_id?: boolean
    driver_id?: boolean
    passengers?: boolean
    destination?: boolean
    purpose?: boolean
    start_time?: boolean
    end_time?: boolean
    actual_start_time?: boolean
    actual_end_time?: boolean
    is_operation?: boolean
    is_stay_in?: boolean
    is_personal?: boolean
    is_out_of_coverage?: boolean
    prepared_by_id?: boolean
    status?: boolean
    cancelled_by?: boolean
    created_by?: boolean
    updated_by?: boolean
    cancelled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type TripTicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
    trip_ticket_approvers?: boolean | TripTicket$trip_ticket_approversArgs<ExtArgs>
    _count?: boolean | TripTicketCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $TripTicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TripTicket"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
      trip_ticket_approvers: Prisma.$TripTicketApproverPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicle_id: string
      driver_id: string
      passengers: string
      destination: string
      purpose: string
      start_time: Date
      end_time: Date
      actual_start_time: Date | null
      actual_end_time: Date | null
      is_operation: boolean
      is_stay_in: boolean
      is_personal: boolean
      is_out_of_coverage: boolean
      prepared_by_id: string
      status: number
      cancelled_by: string | null
      created_by: string
      updated_by: string | null
      cancelled_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["tripTicket"]>
    composites: {}
  }


  type TripTicketGetPayload<S extends boolean | null | undefined | TripTicketDefaultArgs> = $Result.GetResult<Prisma.$TripTicketPayload, S>

  type TripTicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TripTicketFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TripTicketCountAggregateInputType | true
    }

  export interface TripTicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TripTicket'], meta: { name: 'TripTicket' } }
    /**
     * Find zero or one TripTicket that matches the filter.
     * @param {TripTicketFindUniqueArgs} args - Arguments to find a TripTicket
     * @example
     * // Get one TripTicket
     * const tripTicket = await prisma.tripTicket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TripTicketFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketFindUniqueArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one TripTicket that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TripTicketFindUniqueOrThrowArgs} args - Arguments to find a TripTicket
     * @example
     * // Get one TripTicket
     * const tripTicket = await prisma.tripTicket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TripTicketFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first TripTicket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketFindFirstArgs} args - Arguments to find a TripTicket
     * @example
     * // Get one TripTicket
     * const tripTicket = await prisma.tripTicket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TripTicketFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketFindFirstArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first TripTicket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketFindFirstOrThrowArgs} args - Arguments to find a TripTicket
     * @example
     * // Get one TripTicket
     * const tripTicket = await prisma.tripTicket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TripTicketFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more TripTickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TripTickets
     * const tripTickets = await prisma.tripTicket.findMany()
     * 
     * // Get first 10 TripTickets
     * const tripTickets = await prisma.tripTicket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tripTicketWithIdOnly = await prisma.tripTicket.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TripTicketFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a TripTicket.
     * @param {TripTicketCreateArgs} args - Arguments to create a TripTicket.
     * @example
     * // Create one TripTicket
     * const TripTicket = await prisma.tripTicket.create({
     *   data: {
     *     // ... data to create a TripTicket
     *   }
     * })
     * 
    **/
    create<T extends TripTicketCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketCreateArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many TripTickets.
     *     @param {TripTicketCreateManyArgs} args - Arguments to create many TripTickets.
     *     @example
     *     // Create many TripTickets
     *     const tripTicket = await prisma.tripTicket.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TripTicketCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TripTicket.
     * @param {TripTicketDeleteArgs} args - Arguments to delete one TripTicket.
     * @example
     * // Delete one TripTicket
     * const TripTicket = await prisma.tripTicket.delete({
     *   where: {
     *     // ... filter to delete one TripTicket
     *   }
     * })
     * 
    **/
    delete<T extends TripTicketDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketDeleteArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one TripTicket.
     * @param {TripTicketUpdateArgs} args - Arguments to update one TripTicket.
     * @example
     * // Update one TripTicket
     * const tripTicket = await prisma.tripTicket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TripTicketUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketUpdateArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more TripTickets.
     * @param {TripTicketDeleteManyArgs} args - Arguments to filter TripTickets to delete.
     * @example
     * // Delete a few TripTickets
     * const { count } = await prisma.tripTicket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TripTicketDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TripTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TripTickets
     * const tripTicket = await prisma.tripTicket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TripTicketUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TripTicket.
     * @param {TripTicketUpsertArgs} args - Arguments to update or create a TripTicket.
     * @example
     * // Update or create a TripTicket
     * const tripTicket = await prisma.tripTicket.upsert({
     *   create: {
     *     // ... data to create a TripTicket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TripTicket we want to update
     *   }
     * })
    **/
    upsert<T extends TripTicketUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketUpsertArgs<ExtArgs>>
    ): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of TripTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketCountArgs} args - Arguments to filter TripTickets to count.
     * @example
     * // Count the number of TripTickets
     * const count = await prisma.tripTicket.count({
     *   where: {
     *     // ... the filter for the TripTickets we want to count
     *   }
     * })
    **/
    count<T extends TripTicketCountArgs>(
      args?: Subset<T, TripTicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TripTicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TripTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TripTicketAggregateArgs>(args: Subset<T, TripTicketAggregateArgs>): Prisma.PrismaPromise<GetTripTicketAggregateType<T>>

    /**
     * Group by TripTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TripTicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TripTicketGroupByArgs['orderBy'] }
        : { orderBy?: TripTicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TripTicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTripTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TripTicket model
   */
  readonly fields: TripTicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TripTicket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TripTicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    trip_ticket_approvers<T extends TripTicket$trip_ticket_approversArgs<ExtArgs> = {}>(args?: Subset<T, TripTicket$trip_ticket_approversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the TripTicket model
   */ 
  interface TripTicketFieldRefs {
    readonly id: FieldRef<"TripTicket", 'String'>
    readonly vehicle_id: FieldRef<"TripTicket", 'String'>
    readonly driver_id: FieldRef<"TripTicket", 'String'>
    readonly passengers: FieldRef<"TripTicket", 'String'>
    readonly destination: FieldRef<"TripTicket", 'String'>
    readonly purpose: FieldRef<"TripTicket", 'String'>
    readonly start_time: FieldRef<"TripTicket", 'DateTime'>
    readonly end_time: FieldRef<"TripTicket", 'DateTime'>
    readonly actual_start_time: FieldRef<"TripTicket", 'DateTime'>
    readonly actual_end_time: FieldRef<"TripTicket", 'DateTime'>
    readonly is_operation: FieldRef<"TripTicket", 'Boolean'>
    readonly is_stay_in: FieldRef<"TripTicket", 'Boolean'>
    readonly is_personal: FieldRef<"TripTicket", 'Boolean'>
    readonly is_out_of_coverage: FieldRef<"TripTicket", 'Boolean'>
    readonly prepared_by_id: FieldRef<"TripTicket", 'String'>
    readonly status: FieldRef<"TripTicket", 'Int'>
    readonly cancelled_by: FieldRef<"TripTicket", 'String'>
    readonly created_by: FieldRef<"TripTicket", 'String'>
    readonly updated_by: FieldRef<"TripTicket", 'String'>
    readonly cancelled_at: FieldRef<"TripTicket", 'DateTime'>
    readonly created_at: FieldRef<"TripTicket", 'DateTime'>
    readonly updated_at: FieldRef<"TripTicket", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * TripTicket findUnique
   */
  export type TripTicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter, which TripTicket to fetch.
     */
    where: TripTicketWhereUniqueInput
  }


  /**
   * TripTicket findUniqueOrThrow
   */
  export type TripTicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter, which TripTicket to fetch.
     */
    where: TripTicketWhereUniqueInput
  }


  /**
   * TripTicket findFirst
   */
  export type TripTicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter, which TripTicket to fetch.
     */
    where?: TripTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTickets to fetch.
     */
    orderBy?: TripTicketOrderByWithRelationInput | TripTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TripTickets.
     */
    cursor?: TripTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TripTickets.
     */
    distinct?: TripTicketScalarFieldEnum | TripTicketScalarFieldEnum[]
  }


  /**
   * TripTicket findFirstOrThrow
   */
  export type TripTicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter, which TripTicket to fetch.
     */
    where?: TripTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTickets to fetch.
     */
    orderBy?: TripTicketOrderByWithRelationInput | TripTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TripTickets.
     */
    cursor?: TripTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TripTickets.
     */
    distinct?: TripTicketScalarFieldEnum | TripTicketScalarFieldEnum[]
  }


  /**
   * TripTicket findMany
   */
  export type TripTicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter, which TripTickets to fetch.
     */
    where?: TripTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTickets to fetch.
     */
    orderBy?: TripTicketOrderByWithRelationInput | TripTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TripTickets.
     */
    cursor?: TripTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTickets.
     */
    skip?: number
    distinct?: TripTicketScalarFieldEnum | TripTicketScalarFieldEnum[]
  }


  /**
   * TripTicket create
   */
  export type TripTicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * The data needed to create a TripTicket.
     */
    data: XOR<TripTicketCreateInput, TripTicketUncheckedCreateInput>
  }


  /**
   * TripTicket createMany
   */
  export type TripTicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TripTickets.
     */
    data: TripTicketCreateManyInput | TripTicketCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * TripTicket update
   */
  export type TripTicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * The data needed to update a TripTicket.
     */
    data: XOR<TripTicketUpdateInput, TripTicketUncheckedUpdateInput>
    /**
     * Choose, which TripTicket to update.
     */
    where: TripTicketWhereUniqueInput
  }


  /**
   * TripTicket updateMany
   */
  export type TripTicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TripTickets.
     */
    data: XOR<TripTicketUpdateManyMutationInput, TripTicketUncheckedUpdateManyInput>
    /**
     * Filter which TripTickets to update
     */
    where?: TripTicketWhereInput
  }


  /**
   * TripTicket upsert
   */
  export type TripTicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * The filter to search for the TripTicket to update in case it exists.
     */
    where: TripTicketWhereUniqueInput
    /**
     * In case the TripTicket found by the `where` argument doesn't exist, create a new TripTicket with this data.
     */
    create: XOR<TripTicketCreateInput, TripTicketUncheckedCreateInput>
    /**
     * In case the TripTicket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TripTicketUpdateInput, TripTicketUncheckedUpdateInput>
  }


  /**
   * TripTicket delete
   */
  export type TripTicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
    /**
     * Filter which TripTicket to delete.
     */
    where: TripTicketWhereUniqueInput
  }


  /**
   * TripTicket deleteMany
   */
  export type TripTicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TripTickets to delete
     */
    where?: TripTicketWhereInput
  }


  /**
   * TripTicket.trip_ticket_approvers
   */
  export type TripTicket$trip_ticket_approversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    where?: TripTicketApproverWhereInput
    orderBy?: TripTicketApproverOrderByWithRelationInput | TripTicketApproverOrderByWithRelationInput[]
    cursor?: TripTicketApproverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TripTicketApproverScalarFieldEnum | TripTicketApproverScalarFieldEnum[]
  }


  /**
   * TripTicket without action
   */
  export type TripTicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicket
     */
    select?: TripTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketInclude<ExtArgs> | null
  }



  /**
   * Model TripTicketApprover
   */

  export type AggregateTripTicketApprover = {
    _count: TripTicketApproverCountAggregateOutputType | null
    _avg: TripTicketApproverAvgAggregateOutputType | null
    _sum: TripTicketApproverSumAggregateOutputType | null
    _min: TripTicketApproverMinAggregateOutputType | null
    _max: TripTicketApproverMaxAggregateOutputType | null
  }

  export type TripTicketApproverAvgAggregateOutputType = {
    status: number | null
    order: number | null
  }

  export type TripTicketApproverSumAggregateOutputType = {
    status: number | null
    order: number | null
  }

  export type TripTicketApproverMinAggregateOutputType = {
    id: string | null
    trip_ticket_id: string | null
    approver_id: string | null
    date_approval: Date | null
    notes: string | null
    status: number | null
    label: string | null
    order: number | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type TripTicketApproverMaxAggregateOutputType = {
    id: string | null
    trip_ticket_id: string | null
    approver_id: string | null
    date_approval: Date | null
    notes: string | null
    status: number | null
    label: string | null
    order: number | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type TripTicketApproverCountAggregateOutputType = {
    id: number
    trip_ticket_id: number
    approver_id: number
    date_approval: number
    notes: number
    status: number
    label: number
    order: number
    updated_by: number
    updated_at: number
    metadata: number
    _all: number
  }


  export type TripTicketApproverAvgAggregateInputType = {
    status?: true
    order?: true
  }

  export type TripTicketApproverSumAggregateInputType = {
    status?: true
    order?: true
  }

  export type TripTicketApproverMinAggregateInputType = {
    id?: true
    trip_ticket_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
  }

  export type TripTicketApproverMaxAggregateInputType = {
    id?: true
    trip_ticket_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
  }

  export type TripTicketApproverCountAggregateInputType = {
    id?: true
    trip_ticket_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
    metadata?: true
    _all?: true
  }

  export type TripTicketApproverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TripTicketApprover to aggregate.
     */
    where?: TripTicketApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTicketApprovers to fetch.
     */
    orderBy?: TripTicketApproverOrderByWithRelationInput | TripTicketApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TripTicketApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTicketApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTicketApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TripTicketApprovers
    **/
    _count?: true | TripTicketApproverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TripTicketApproverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TripTicketApproverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TripTicketApproverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TripTicketApproverMaxAggregateInputType
  }

  export type GetTripTicketApproverAggregateType<T extends TripTicketApproverAggregateArgs> = {
        [P in keyof T & keyof AggregateTripTicketApprover]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTripTicketApprover[P]>
      : GetScalarType<T[P], AggregateTripTicketApprover[P]>
  }




  export type TripTicketApproverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TripTicketApproverWhereInput
    orderBy?: TripTicketApproverOrderByWithAggregationInput | TripTicketApproverOrderByWithAggregationInput[]
    by: TripTicketApproverScalarFieldEnum[] | TripTicketApproverScalarFieldEnum
    having?: TripTicketApproverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TripTicketApproverCountAggregateInputType | true
    _avg?: TripTicketApproverAvgAggregateInputType
    _sum?: TripTicketApproverSumAggregateInputType
    _min?: TripTicketApproverMinAggregateInputType
    _max?: TripTicketApproverMaxAggregateInputType
  }

  export type TripTicketApproverGroupByOutputType = {
    id: string
    trip_ticket_id: string
    approver_id: string
    date_approval: Date | null
    notes: string
    status: number
    label: string
    order: number
    updated_by: string | null
    updated_at: Date
    metadata: JsonValue | null
    _count: TripTicketApproverCountAggregateOutputType | null
    _avg: TripTicketApproverAvgAggregateOutputType | null
    _sum: TripTicketApproverSumAggregateOutputType | null
    _min: TripTicketApproverMinAggregateOutputType | null
    _max: TripTicketApproverMaxAggregateOutputType | null
  }

  type GetTripTicketApproverGroupByPayload<T extends TripTicketApproverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TripTicketApproverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TripTicketApproverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TripTicketApproverGroupByOutputType[P]>
            : GetScalarType<T[P], TripTicketApproverGroupByOutputType[P]>
        }
      >
    >


  export type TripTicketApproverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trip_ticket_id?: boolean
    approver_id?: boolean
    date_approval?: boolean
    notes?: boolean
    status?: boolean
    label?: boolean
    order?: boolean
    updated_by?: boolean
    updated_at?: boolean
    metadata?: boolean
    trip_ticket?: boolean | TripTicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tripTicketApprover"]>

  export type TripTicketApproverSelectScalar = {
    id?: boolean
    trip_ticket_id?: boolean
    approver_id?: boolean
    date_approval?: boolean
    notes?: boolean
    status?: boolean
    label?: boolean
    order?: boolean
    updated_by?: boolean
    updated_at?: boolean
    metadata?: boolean
  }

  export type TripTicketApproverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trip_ticket?: boolean | TripTicketDefaultArgs<ExtArgs>
  }


  export type $TripTicketApproverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TripTicketApprover"
    objects: {
      trip_ticket: Prisma.$TripTicketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      trip_ticket_id: string
      approver_id: string
      date_approval: Date | null
      notes: string
      status: number
      label: string
      order: number
      updated_by: string | null
      updated_at: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["tripTicketApprover"]>
    composites: {}
  }


  type TripTicketApproverGetPayload<S extends boolean | null | undefined | TripTicketApproverDefaultArgs> = $Result.GetResult<Prisma.$TripTicketApproverPayload, S>

  type TripTicketApproverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TripTicketApproverFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TripTicketApproverCountAggregateInputType | true
    }

  export interface TripTicketApproverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TripTicketApprover'], meta: { name: 'TripTicketApprover' } }
    /**
     * Find zero or one TripTicketApprover that matches the filter.
     * @param {TripTicketApproverFindUniqueArgs} args - Arguments to find a TripTicketApprover
     * @example
     * // Get one TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TripTicketApproverFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverFindUniqueArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one TripTicketApprover that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TripTicketApproverFindUniqueOrThrowArgs} args - Arguments to find a TripTicketApprover
     * @example
     * // Get one TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TripTicketApproverFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first TripTicketApprover that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverFindFirstArgs} args - Arguments to find a TripTicketApprover
     * @example
     * // Get one TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TripTicketApproverFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverFindFirstArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first TripTicketApprover that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverFindFirstOrThrowArgs} args - Arguments to find a TripTicketApprover
     * @example
     * // Get one TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TripTicketApproverFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more TripTicketApprovers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TripTicketApprovers
     * const tripTicketApprovers = await prisma.tripTicketApprover.findMany()
     * 
     * // Get first 10 TripTicketApprovers
     * const tripTicketApprovers = await prisma.tripTicketApprover.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tripTicketApproverWithIdOnly = await prisma.tripTicketApprover.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TripTicketApproverFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a TripTicketApprover.
     * @param {TripTicketApproverCreateArgs} args - Arguments to create a TripTicketApprover.
     * @example
     * // Create one TripTicketApprover
     * const TripTicketApprover = await prisma.tripTicketApprover.create({
     *   data: {
     *     // ... data to create a TripTicketApprover
     *   }
     * })
     * 
    **/
    create<T extends TripTicketApproverCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverCreateArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many TripTicketApprovers.
     *     @param {TripTicketApproverCreateManyArgs} args - Arguments to create many TripTicketApprovers.
     *     @example
     *     // Create many TripTicketApprovers
     *     const tripTicketApprover = await prisma.tripTicketApprover.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TripTicketApproverCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TripTicketApprover.
     * @param {TripTicketApproverDeleteArgs} args - Arguments to delete one TripTicketApprover.
     * @example
     * // Delete one TripTicketApprover
     * const TripTicketApprover = await prisma.tripTicketApprover.delete({
     *   where: {
     *     // ... filter to delete one TripTicketApprover
     *   }
     * })
     * 
    **/
    delete<T extends TripTicketApproverDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverDeleteArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one TripTicketApprover.
     * @param {TripTicketApproverUpdateArgs} args - Arguments to update one TripTicketApprover.
     * @example
     * // Update one TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TripTicketApproverUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverUpdateArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more TripTicketApprovers.
     * @param {TripTicketApproverDeleteManyArgs} args - Arguments to filter TripTicketApprovers to delete.
     * @example
     * // Delete a few TripTicketApprovers
     * const { count } = await prisma.tripTicketApprover.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TripTicketApproverDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TripTicketApproverDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TripTicketApprovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TripTicketApprovers
     * const tripTicketApprover = await prisma.tripTicketApprover.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TripTicketApproverUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TripTicketApprover.
     * @param {TripTicketApproverUpsertArgs} args - Arguments to update or create a TripTicketApprover.
     * @example
     * // Update or create a TripTicketApprover
     * const tripTicketApprover = await prisma.tripTicketApprover.upsert({
     *   create: {
     *     // ... data to create a TripTicketApprover
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TripTicketApprover we want to update
     *   }
     * })
    **/
    upsert<T extends TripTicketApproverUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TripTicketApproverUpsertArgs<ExtArgs>>
    ): Prisma__TripTicketApproverClient<$Result.GetResult<Prisma.$TripTicketApproverPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of TripTicketApprovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverCountArgs} args - Arguments to filter TripTicketApprovers to count.
     * @example
     * // Count the number of TripTicketApprovers
     * const count = await prisma.tripTicketApprover.count({
     *   where: {
     *     // ... the filter for the TripTicketApprovers we want to count
     *   }
     * })
    **/
    count<T extends TripTicketApproverCountArgs>(
      args?: Subset<T, TripTicketApproverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TripTicketApproverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TripTicketApprover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TripTicketApproverAggregateArgs>(args: Subset<T, TripTicketApproverAggregateArgs>): Prisma.PrismaPromise<GetTripTicketApproverAggregateType<T>>

    /**
     * Group by TripTicketApprover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripTicketApproverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TripTicketApproverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TripTicketApproverGroupByArgs['orderBy'] }
        : { orderBy?: TripTicketApproverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TripTicketApproverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTripTicketApproverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TripTicketApprover model
   */
  readonly fields: TripTicketApproverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TripTicketApprover.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TripTicketApproverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    trip_ticket<T extends TripTicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TripTicketDefaultArgs<ExtArgs>>): Prisma__TripTicketClient<$Result.GetResult<Prisma.$TripTicketPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the TripTicketApprover model
   */ 
  interface TripTicketApproverFieldRefs {
    readonly id: FieldRef<"TripTicketApprover", 'String'>
    readonly trip_ticket_id: FieldRef<"TripTicketApprover", 'String'>
    readonly approver_id: FieldRef<"TripTicketApprover", 'String'>
    readonly date_approval: FieldRef<"TripTicketApprover", 'DateTime'>
    readonly notes: FieldRef<"TripTicketApprover", 'String'>
    readonly status: FieldRef<"TripTicketApprover", 'Int'>
    readonly label: FieldRef<"TripTicketApprover", 'String'>
    readonly order: FieldRef<"TripTicketApprover", 'Int'>
    readonly updated_by: FieldRef<"TripTicketApprover", 'String'>
    readonly updated_at: FieldRef<"TripTicketApprover", 'DateTime'>
    readonly metadata: FieldRef<"TripTicketApprover", 'Json'>
  }
    

  // Custom InputTypes

  /**
   * TripTicketApprover findUnique
   */
  export type TripTicketApproverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter, which TripTicketApprover to fetch.
     */
    where: TripTicketApproverWhereUniqueInput
  }


  /**
   * TripTicketApprover findUniqueOrThrow
   */
  export type TripTicketApproverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter, which TripTicketApprover to fetch.
     */
    where: TripTicketApproverWhereUniqueInput
  }


  /**
   * TripTicketApprover findFirst
   */
  export type TripTicketApproverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter, which TripTicketApprover to fetch.
     */
    where?: TripTicketApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTicketApprovers to fetch.
     */
    orderBy?: TripTicketApproverOrderByWithRelationInput | TripTicketApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TripTicketApprovers.
     */
    cursor?: TripTicketApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTicketApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTicketApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TripTicketApprovers.
     */
    distinct?: TripTicketApproverScalarFieldEnum | TripTicketApproverScalarFieldEnum[]
  }


  /**
   * TripTicketApprover findFirstOrThrow
   */
  export type TripTicketApproverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter, which TripTicketApprover to fetch.
     */
    where?: TripTicketApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTicketApprovers to fetch.
     */
    orderBy?: TripTicketApproverOrderByWithRelationInput | TripTicketApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TripTicketApprovers.
     */
    cursor?: TripTicketApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTicketApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTicketApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TripTicketApprovers.
     */
    distinct?: TripTicketApproverScalarFieldEnum | TripTicketApproverScalarFieldEnum[]
  }


  /**
   * TripTicketApprover findMany
   */
  export type TripTicketApproverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter, which TripTicketApprovers to fetch.
     */
    where?: TripTicketApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TripTicketApprovers to fetch.
     */
    orderBy?: TripTicketApproverOrderByWithRelationInput | TripTicketApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TripTicketApprovers.
     */
    cursor?: TripTicketApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TripTicketApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TripTicketApprovers.
     */
    skip?: number
    distinct?: TripTicketApproverScalarFieldEnum | TripTicketApproverScalarFieldEnum[]
  }


  /**
   * TripTicketApprover create
   */
  export type TripTicketApproverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * The data needed to create a TripTicketApprover.
     */
    data: XOR<TripTicketApproverCreateInput, TripTicketApproverUncheckedCreateInput>
  }


  /**
   * TripTicketApprover createMany
   */
  export type TripTicketApproverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TripTicketApprovers.
     */
    data: TripTicketApproverCreateManyInput | TripTicketApproverCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * TripTicketApprover update
   */
  export type TripTicketApproverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * The data needed to update a TripTicketApprover.
     */
    data: XOR<TripTicketApproverUpdateInput, TripTicketApproverUncheckedUpdateInput>
    /**
     * Choose, which TripTicketApprover to update.
     */
    where: TripTicketApproverWhereUniqueInput
  }


  /**
   * TripTicketApprover updateMany
   */
  export type TripTicketApproverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TripTicketApprovers.
     */
    data: XOR<TripTicketApproverUpdateManyMutationInput, TripTicketApproverUncheckedUpdateManyInput>
    /**
     * Filter which TripTicketApprovers to update
     */
    where?: TripTicketApproverWhereInput
  }


  /**
   * TripTicketApprover upsert
   */
  export type TripTicketApproverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * The filter to search for the TripTicketApprover to update in case it exists.
     */
    where: TripTicketApproverWhereUniqueInput
    /**
     * In case the TripTicketApprover found by the `where` argument doesn't exist, create a new TripTicketApprover with this data.
     */
    create: XOR<TripTicketApproverCreateInput, TripTicketApproverUncheckedCreateInput>
    /**
     * In case the TripTicketApprover was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TripTicketApproverUpdateInput, TripTicketApproverUncheckedUpdateInput>
  }


  /**
   * TripTicketApprover delete
   */
  export type TripTicketApproverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
    /**
     * Filter which TripTicketApprover to delete.
     */
    where: TripTicketApproverWhereUniqueInput
  }


  /**
   * TripTicketApprover deleteMany
   */
  export type TripTicketApproverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TripTicketApprovers to delete
     */
    where?: TripTicketApproverWhereInput
  }


  /**
   * TripTicketApprover without action
   */
  export type TripTicketApproverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TripTicketApprover
     */
    select?: TripTicketApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TripTicketApproverInclude<ExtArgs> | null
  }



  /**
   * Model GasSlip
   */

  export type AggregateGasSlip = {
    _count: GasSlipCountAggregateOutputType | null
    _avg: GasSlipAvgAggregateOutputType | null
    _sum: GasSlipSumAggregateOutputType | null
    _min: GasSlipMinAggregateOutputType | null
    _max: GasSlipMaxAggregateOutputType | null
  }

  export type GasSlipAvgAggregateOutputType = {
    gas_station_id: number | null
    fuel_type_id: number | null
    actual_liter: number | null
    price_per_liter: number | null
    print_count: number | null
  }

  export type GasSlipSumAggregateOutputType = {
    gas_station_id: number | null
    fuel_type_id: number | null
    actual_liter: number | null
    price_per_liter: number | null
    print_count: number | null
  }

  export type GasSlipMinAggregateOutputType = {
    id: string | null
    gas_slip_number: string | null
    vehicle_id: string | null
    driver_id: string | null
    gas_station_id: number | null
    fuel_type_id: number | null
    requested_by_id: string | null
    with_container: boolean | null
    liter_in_text: string | null
    actual_liter: number | null
    price_per_liter: number | null
    purpose: string | null
    is_posted: boolean | null
    print_count: number | null
    cancelled_by: string | null
    created_by: string | null
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GasSlipMaxAggregateOutputType = {
    id: string | null
    gas_slip_number: string | null
    vehicle_id: string | null
    driver_id: string | null
    gas_station_id: number | null
    fuel_type_id: number | null
    requested_by_id: string | null
    with_container: boolean | null
    liter_in_text: string | null
    actual_liter: number | null
    price_per_liter: number | null
    purpose: string | null
    is_posted: boolean | null
    print_count: number | null
    cancelled_by: string | null
    created_by: string | null
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GasSlipCountAggregateOutputType = {
    id: number
    gas_slip_number: number
    vehicle_id: number
    driver_id: number
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: number
    with_container: number
    liter_in_text: number
    actual_liter: number
    price_per_liter: number
    purpose: number
    is_posted: number
    print_count: number
    cancelled_by: number
    created_by: number
    updated_by: number
    cancelled_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type GasSlipAvgAggregateInputType = {
    gas_station_id?: true
    fuel_type_id?: true
    actual_liter?: true
    price_per_liter?: true
    print_count?: true
  }

  export type GasSlipSumAggregateInputType = {
    gas_station_id?: true
    fuel_type_id?: true
    actual_liter?: true
    price_per_liter?: true
    print_count?: true
  }

  export type GasSlipMinAggregateInputType = {
    id?: true
    gas_slip_number?: true
    vehicle_id?: true
    driver_id?: true
    gas_station_id?: true
    fuel_type_id?: true
    requested_by_id?: true
    with_container?: true
    liter_in_text?: true
    actual_liter?: true
    price_per_liter?: true
    purpose?: true
    is_posted?: true
    print_count?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type GasSlipMaxAggregateInputType = {
    id?: true
    gas_slip_number?: true
    vehicle_id?: true
    driver_id?: true
    gas_station_id?: true
    fuel_type_id?: true
    requested_by_id?: true
    with_container?: true
    liter_in_text?: true
    actual_liter?: true
    price_per_liter?: true
    purpose?: true
    is_posted?: true
    print_count?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type GasSlipCountAggregateInputType = {
    id?: true
    gas_slip_number?: true
    vehicle_id?: true
    driver_id?: true
    gas_station_id?: true
    fuel_type_id?: true
    requested_by_id?: true
    with_container?: true
    liter_in_text?: true
    actual_liter?: true
    price_per_liter?: true
    purpose?: true
    is_posted?: true
    print_count?: true
    cancelled_by?: true
    created_by?: true
    updated_by?: true
    cancelled_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type GasSlipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasSlip to aggregate.
     */
    where?: GasSlipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlips to fetch.
     */
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GasSlipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GasSlips
    **/
    _count?: true | GasSlipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GasSlipAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GasSlipSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GasSlipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GasSlipMaxAggregateInputType
  }

  export type GetGasSlipAggregateType<T extends GasSlipAggregateArgs> = {
        [P in keyof T & keyof AggregateGasSlip]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGasSlip[P]>
      : GetScalarType<T[P], AggregateGasSlip[P]>
  }




  export type GasSlipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipWhereInput
    orderBy?: GasSlipOrderByWithAggregationInput | GasSlipOrderByWithAggregationInput[]
    by: GasSlipScalarFieldEnum[] | GasSlipScalarFieldEnum
    having?: GasSlipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GasSlipCountAggregateInputType | true
    _avg?: GasSlipAvgAggregateInputType
    _sum?: GasSlipSumAggregateInputType
    _min?: GasSlipMinAggregateInputType
    _max?: GasSlipMaxAggregateInputType
  }

  export type GasSlipGroupByOutputType = {
    id: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter: number | null
    price_per_liter: number | null
    purpose: string
    is_posted: boolean
    print_count: number
    cancelled_by: string | null
    created_by: string
    updated_by: string | null
    cancelled_at: Date | null
    created_at: Date
    updated_at: Date
    _count: GasSlipCountAggregateOutputType | null
    _avg: GasSlipAvgAggregateOutputType | null
    _sum: GasSlipSumAggregateOutputType | null
    _min: GasSlipMinAggregateOutputType | null
    _max: GasSlipMaxAggregateOutputType | null
  }

  type GetGasSlipGroupByPayload<T extends GasSlipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GasSlipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GasSlipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GasSlipGroupByOutputType[P]>
            : GetScalarType<T[P], GasSlipGroupByOutputType[P]>
        }
      >
    >


  export type GasSlipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gas_slip_number?: boolean
    vehicle_id?: boolean
    driver_id?: boolean
    gas_station_id?: boolean
    fuel_type_id?: boolean
    requested_by_id?: boolean
    with_container?: boolean
    liter_in_text?: boolean
    actual_liter?: boolean
    price_per_liter?: boolean
    purpose?: boolean
    is_posted?: boolean
    print_count?: boolean
    cancelled_by?: boolean
    created_by?: boolean
    updated_by?: boolean
    cancelled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
    gas_station?: boolean | GasStationDefaultArgs<ExtArgs>
    fuel_type?: boolean | FuelTypeDefaultArgs<ExtArgs>
    gas_slip_approvers?: boolean | GasSlip$gas_slip_approversArgs<ExtArgs>
    _count?: boolean | GasSlipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gasSlip"]>

  export type GasSlipSelectScalar = {
    id?: boolean
    gas_slip_number?: boolean
    vehicle_id?: boolean
    driver_id?: boolean
    gas_station_id?: boolean
    fuel_type_id?: boolean
    requested_by_id?: boolean
    with_container?: boolean
    liter_in_text?: boolean
    actual_liter?: boolean
    price_per_liter?: boolean
    purpose?: boolean
    is_posted?: boolean
    print_count?: boolean
    cancelled_by?: boolean
    created_by?: boolean
    updated_by?: boolean
    cancelled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type GasSlipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
    gas_station?: boolean | GasStationDefaultArgs<ExtArgs>
    fuel_type?: boolean | FuelTypeDefaultArgs<ExtArgs>
    gas_slip_approvers?: boolean | GasSlip$gas_slip_approversArgs<ExtArgs>
    _count?: boolean | GasSlipCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $GasSlipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GasSlip"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
      gas_station: Prisma.$GasStationPayload<ExtArgs>
      fuel_type: Prisma.$FuelTypePayload<ExtArgs>
      gas_slip_approvers: Prisma.$GasSlipApproverPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gas_slip_number: string
      vehicle_id: string
      driver_id: string
      gas_station_id: number
      fuel_type_id: number
      requested_by_id: string
      with_container: boolean
      liter_in_text: string
      actual_liter: number | null
      price_per_liter: number | null
      purpose: string
      is_posted: boolean
      print_count: number
      cancelled_by: string | null
      created_by: string
      updated_by: string | null
      cancelled_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["gasSlip"]>
    composites: {}
  }


  type GasSlipGetPayload<S extends boolean | null | undefined | GasSlipDefaultArgs> = $Result.GetResult<Prisma.$GasSlipPayload, S>

  type GasSlipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GasSlipFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GasSlipCountAggregateInputType | true
    }

  export interface GasSlipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GasSlip'], meta: { name: 'GasSlip' } }
    /**
     * Find zero or one GasSlip that matches the filter.
     * @param {GasSlipFindUniqueArgs} args - Arguments to find a GasSlip
     * @example
     * // Get one GasSlip
     * const gasSlip = await prisma.gasSlip.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends GasSlipFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipFindUniqueArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one GasSlip that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {GasSlipFindUniqueOrThrowArgs} args - Arguments to find a GasSlip
     * @example
     * // Get one GasSlip
     * const gasSlip = await prisma.gasSlip.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends GasSlipFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first GasSlip that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipFindFirstArgs} args - Arguments to find a GasSlip
     * @example
     * // Get one GasSlip
     * const gasSlip = await prisma.gasSlip.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends GasSlipFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipFindFirstArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first GasSlip that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipFindFirstOrThrowArgs} args - Arguments to find a GasSlip
     * @example
     * // Get one GasSlip
     * const gasSlip = await prisma.gasSlip.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends GasSlipFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more GasSlips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GasSlips
     * const gasSlips = await prisma.gasSlip.findMany()
     * 
     * // Get first 10 GasSlips
     * const gasSlips = await prisma.gasSlip.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gasSlipWithIdOnly = await prisma.gasSlip.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends GasSlipFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a GasSlip.
     * @param {GasSlipCreateArgs} args - Arguments to create a GasSlip.
     * @example
     * // Create one GasSlip
     * const GasSlip = await prisma.gasSlip.create({
     *   data: {
     *     // ... data to create a GasSlip
     *   }
     * })
     * 
    **/
    create<T extends GasSlipCreateArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipCreateArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many GasSlips.
     *     @param {GasSlipCreateManyArgs} args - Arguments to create many GasSlips.
     *     @example
     *     // Create many GasSlips
     *     const gasSlip = await prisma.gasSlip.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends GasSlipCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GasSlip.
     * @param {GasSlipDeleteArgs} args - Arguments to delete one GasSlip.
     * @example
     * // Delete one GasSlip
     * const GasSlip = await prisma.gasSlip.delete({
     *   where: {
     *     // ... filter to delete one GasSlip
     *   }
     * })
     * 
    **/
    delete<T extends GasSlipDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipDeleteArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one GasSlip.
     * @param {GasSlipUpdateArgs} args - Arguments to update one GasSlip.
     * @example
     * // Update one GasSlip
     * const gasSlip = await prisma.gasSlip.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GasSlipUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipUpdateArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more GasSlips.
     * @param {GasSlipDeleteManyArgs} args - Arguments to filter GasSlips to delete.
     * @example
     * // Delete a few GasSlips
     * const { count } = await prisma.gasSlip.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GasSlipDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GasSlips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GasSlips
     * const gasSlip = await prisma.gasSlip.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GasSlipUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GasSlip.
     * @param {GasSlipUpsertArgs} args - Arguments to update or create a GasSlip.
     * @example
     * // Update or create a GasSlip
     * const gasSlip = await prisma.gasSlip.upsert({
     *   create: {
     *     // ... data to create a GasSlip
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GasSlip we want to update
     *   }
     * })
    **/
    upsert<T extends GasSlipUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipUpsertArgs<ExtArgs>>
    ): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of GasSlips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipCountArgs} args - Arguments to filter GasSlips to count.
     * @example
     * // Count the number of GasSlips
     * const count = await prisma.gasSlip.count({
     *   where: {
     *     // ... the filter for the GasSlips we want to count
     *   }
     * })
    **/
    count<T extends GasSlipCountArgs>(
      args?: Subset<T, GasSlipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GasSlipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GasSlip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GasSlipAggregateArgs>(args: Subset<T, GasSlipAggregateArgs>): Prisma.PrismaPromise<GetGasSlipAggregateType<T>>

    /**
     * Group by GasSlip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GasSlipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GasSlipGroupByArgs['orderBy'] }
        : { orderBy?: GasSlipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GasSlipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGasSlipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GasSlip model
   */
  readonly fields: GasSlipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GasSlip.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GasSlipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    gas_station<T extends GasStationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GasStationDefaultArgs<ExtArgs>>): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    fuel_type<T extends FuelTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FuelTypeDefaultArgs<ExtArgs>>): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    gas_slip_approvers<T extends GasSlip$gas_slip_approversArgs<ExtArgs> = {}>(args?: Subset<T, GasSlip$gas_slip_approversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the GasSlip model
   */ 
  interface GasSlipFieldRefs {
    readonly id: FieldRef<"GasSlip", 'String'>
    readonly gas_slip_number: FieldRef<"GasSlip", 'String'>
    readonly vehicle_id: FieldRef<"GasSlip", 'String'>
    readonly driver_id: FieldRef<"GasSlip", 'String'>
    readonly gas_station_id: FieldRef<"GasSlip", 'Int'>
    readonly fuel_type_id: FieldRef<"GasSlip", 'Int'>
    readonly requested_by_id: FieldRef<"GasSlip", 'String'>
    readonly with_container: FieldRef<"GasSlip", 'Boolean'>
    readonly liter_in_text: FieldRef<"GasSlip", 'String'>
    readonly actual_liter: FieldRef<"GasSlip", 'Float'>
    readonly price_per_liter: FieldRef<"GasSlip", 'Float'>
    readonly purpose: FieldRef<"GasSlip", 'String'>
    readonly is_posted: FieldRef<"GasSlip", 'Boolean'>
    readonly print_count: FieldRef<"GasSlip", 'Int'>
    readonly cancelled_by: FieldRef<"GasSlip", 'String'>
    readonly created_by: FieldRef<"GasSlip", 'String'>
    readonly updated_by: FieldRef<"GasSlip", 'String'>
    readonly cancelled_at: FieldRef<"GasSlip", 'DateTime'>
    readonly created_at: FieldRef<"GasSlip", 'DateTime'>
    readonly updated_at: FieldRef<"GasSlip", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * GasSlip findUnique
   */
  export type GasSlipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter, which GasSlip to fetch.
     */
    where: GasSlipWhereUniqueInput
  }


  /**
   * GasSlip findUniqueOrThrow
   */
  export type GasSlipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter, which GasSlip to fetch.
     */
    where: GasSlipWhereUniqueInput
  }


  /**
   * GasSlip findFirst
   */
  export type GasSlipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter, which GasSlip to fetch.
     */
    where?: GasSlipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlips to fetch.
     */
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasSlips.
     */
    cursor?: GasSlipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasSlips.
     */
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * GasSlip findFirstOrThrow
   */
  export type GasSlipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter, which GasSlip to fetch.
     */
    where?: GasSlipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlips to fetch.
     */
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasSlips.
     */
    cursor?: GasSlipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasSlips.
     */
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * GasSlip findMany
   */
  export type GasSlipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter, which GasSlips to fetch.
     */
    where?: GasSlipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlips to fetch.
     */
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GasSlips.
     */
    cursor?: GasSlipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlips.
     */
    skip?: number
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * GasSlip create
   */
  export type GasSlipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * The data needed to create a GasSlip.
     */
    data: XOR<GasSlipCreateInput, GasSlipUncheckedCreateInput>
  }


  /**
   * GasSlip createMany
   */
  export type GasSlipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GasSlips.
     */
    data: GasSlipCreateManyInput | GasSlipCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * GasSlip update
   */
  export type GasSlipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * The data needed to update a GasSlip.
     */
    data: XOR<GasSlipUpdateInput, GasSlipUncheckedUpdateInput>
    /**
     * Choose, which GasSlip to update.
     */
    where: GasSlipWhereUniqueInput
  }


  /**
   * GasSlip updateMany
   */
  export type GasSlipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GasSlips.
     */
    data: XOR<GasSlipUpdateManyMutationInput, GasSlipUncheckedUpdateManyInput>
    /**
     * Filter which GasSlips to update
     */
    where?: GasSlipWhereInput
  }


  /**
   * GasSlip upsert
   */
  export type GasSlipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * The filter to search for the GasSlip to update in case it exists.
     */
    where: GasSlipWhereUniqueInput
    /**
     * In case the GasSlip found by the `where` argument doesn't exist, create a new GasSlip with this data.
     */
    create: XOR<GasSlipCreateInput, GasSlipUncheckedCreateInput>
    /**
     * In case the GasSlip was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GasSlipUpdateInput, GasSlipUncheckedUpdateInput>
  }


  /**
   * GasSlip delete
   */
  export type GasSlipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    /**
     * Filter which GasSlip to delete.
     */
    where: GasSlipWhereUniqueInput
  }


  /**
   * GasSlip deleteMany
   */
  export type GasSlipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasSlips to delete
     */
    where?: GasSlipWhereInput
  }


  /**
   * GasSlip.gas_slip_approvers
   */
  export type GasSlip$gas_slip_approversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    where?: GasSlipApproverWhereInput
    orderBy?: GasSlipApproverOrderByWithRelationInput | GasSlipApproverOrderByWithRelationInput[]
    cursor?: GasSlipApproverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GasSlipApproverScalarFieldEnum | GasSlipApproverScalarFieldEnum[]
  }


  /**
   * GasSlip without action
   */
  export type GasSlipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
  }



  /**
   * Model GasSlipApprover
   */

  export type AggregateGasSlipApprover = {
    _count: GasSlipApproverCountAggregateOutputType | null
    _avg: GasSlipApproverAvgAggregateOutputType | null
    _sum: GasSlipApproverSumAggregateOutputType | null
    _min: GasSlipApproverMinAggregateOutputType | null
    _max: GasSlipApproverMaxAggregateOutputType | null
  }

  export type GasSlipApproverAvgAggregateOutputType = {
    status: number | null
    order: number | null
  }

  export type GasSlipApproverSumAggregateOutputType = {
    status: number | null
    order: number | null
  }

  export type GasSlipApproverMinAggregateOutputType = {
    id: string | null
    gas_slip_id: string | null
    approver_id: string | null
    date_approval: Date | null
    notes: string | null
    status: number | null
    label: string | null
    order: number | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type GasSlipApproverMaxAggregateOutputType = {
    id: string | null
    gas_slip_id: string | null
    approver_id: string | null
    date_approval: Date | null
    notes: string | null
    status: number | null
    label: string | null
    order: number | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type GasSlipApproverCountAggregateOutputType = {
    id: number
    gas_slip_id: number
    approver_id: number
    date_approval: number
    notes: number
    status: number
    label: number
    order: number
    updated_by: number
    updated_at: number
    metadata: number
    _all: number
  }


  export type GasSlipApproverAvgAggregateInputType = {
    status?: true
    order?: true
  }

  export type GasSlipApproverSumAggregateInputType = {
    status?: true
    order?: true
  }

  export type GasSlipApproverMinAggregateInputType = {
    id?: true
    gas_slip_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
  }

  export type GasSlipApproverMaxAggregateInputType = {
    id?: true
    gas_slip_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
  }

  export type GasSlipApproverCountAggregateInputType = {
    id?: true
    gas_slip_id?: true
    approver_id?: true
    date_approval?: true
    notes?: true
    status?: true
    label?: true
    order?: true
    updated_by?: true
    updated_at?: true
    metadata?: true
    _all?: true
  }

  export type GasSlipApproverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasSlipApprover to aggregate.
     */
    where?: GasSlipApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlipApprovers to fetch.
     */
    orderBy?: GasSlipApproverOrderByWithRelationInput | GasSlipApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GasSlipApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlipApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlipApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GasSlipApprovers
    **/
    _count?: true | GasSlipApproverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GasSlipApproverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GasSlipApproverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GasSlipApproverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GasSlipApproverMaxAggregateInputType
  }

  export type GetGasSlipApproverAggregateType<T extends GasSlipApproverAggregateArgs> = {
        [P in keyof T & keyof AggregateGasSlipApprover]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGasSlipApprover[P]>
      : GetScalarType<T[P], AggregateGasSlipApprover[P]>
  }




  export type GasSlipApproverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasSlipApproverWhereInput
    orderBy?: GasSlipApproverOrderByWithAggregationInput | GasSlipApproverOrderByWithAggregationInput[]
    by: GasSlipApproverScalarFieldEnum[] | GasSlipApproverScalarFieldEnum
    having?: GasSlipApproverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GasSlipApproverCountAggregateInputType | true
    _avg?: GasSlipApproverAvgAggregateInputType
    _sum?: GasSlipApproverSumAggregateInputType
    _min?: GasSlipApproverMinAggregateInputType
    _max?: GasSlipApproverMaxAggregateInputType
  }

  export type GasSlipApproverGroupByOutputType = {
    id: string
    gas_slip_id: string
    approver_id: string
    date_approval: Date | null
    notes: string
    status: number
    label: string
    order: number
    updated_by: string | null
    updated_at: Date
    metadata: JsonValue | null
    _count: GasSlipApproverCountAggregateOutputType | null
    _avg: GasSlipApproverAvgAggregateOutputType | null
    _sum: GasSlipApproverSumAggregateOutputType | null
    _min: GasSlipApproverMinAggregateOutputType | null
    _max: GasSlipApproverMaxAggregateOutputType | null
  }

  type GetGasSlipApproverGroupByPayload<T extends GasSlipApproverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GasSlipApproverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GasSlipApproverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GasSlipApproverGroupByOutputType[P]>
            : GetScalarType<T[P], GasSlipApproverGroupByOutputType[P]>
        }
      >
    >


  export type GasSlipApproverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gas_slip_id?: boolean
    approver_id?: boolean
    date_approval?: boolean
    notes?: boolean
    status?: boolean
    label?: boolean
    order?: boolean
    updated_by?: boolean
    updated_at?: boolean
    metadata?: boolean
    gas_slip?: boolean | GasSlipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gasSlipApprover"]>

  export type GasSlipApproverSelectScalar = {
    id?: boolean
    gas_slip_id?: boolean
    approver_id?: boolean
    date_approval?: boolean
    notes?: boolean
    status?: boolean
    label?: boolean
    order?: boolean
    updated_by?: boolean
    updated_at?: boolean
    metadata?: boolean
  }

  export type GasSlipApproverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slip?: boolean | GasSlipDefaultArgs<ExtArgs>
  }


  export type $GasSlipApproverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GasSlipApprover"
    objects: {
      gas_slip: Prisma.$GasSlipPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gas_slip_id: string
      approver_id: string
      date_approval: Date | null
      notes: string
      status: number
      label: string
      order: number
      updated_by: string | null
      updated_at: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["gasSlipApprover"]>
    composites: {}
  }


  type GasSlipApproverGetPayload<S extends boolean | null | undefined | GasSlipApproverDefaultArgs> = $Result.GetResult<Prisma.$GasSlipApproverPayload, S>

  type GasSlipApproverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GasSlipApproverFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GasSlipApproverCountAggregateInputType | true
    }

  export interface GasSlipApproverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GasSlipApprover'], meta: { name: 'GasSlipApprover' } }
    /**
     * Find zero or one GasSlipApprover that matches the filter.
     * @param {GasSlipApproverFindUniqueArgs} args - Arguments to find a GasSlipApprover
     * @example
     * // Get one GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends GasSlipApproverFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverFindUniqueArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one GasSlipApprover that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {GasSlipApproverFindUniqueOrThrowArgs} args - Arguments to find a GasSlipApprover
     * @example
     * // Get one GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends GasSlipApproverFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first GasSlipApprover that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverFindFirstArgs} args - Arguments to find a GasSlipApprover
     * @example
     * // Get one GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends GasSlipApproverFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverFindFirstArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first GasSlipApprover that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverFindFirstOrThrowArgs} args - Arguments to find a GasSlipApprover
     * @example
     * // Get one GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends GasSlipApproverFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more GasSlipApprovers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GasSlipApprovers
     * const gasSlipApprovers = await prisma.gasSlipApprover.findMany()
     * 
     * // Get first 10 GasSlipApprovers
     * const gasSlipApprovers = await prisma.gasSlipApprover.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gasSlipApproverWithIdOnly = await prisma.gasSlipApprover.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends GasSlipApproverFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a GasSlipApprover.
     * @param {GasSlipApproverCreateArgs} args - Arguments to create a GasSlipApprover.
     * @example
     * // Create one GasSlipApprover
     * const GasSlipApprover = await prisma.gasSlipApprover.create({
     *   data: {
     *     // ... data to create a GasSlipApprover
     *   }
     * })
     * 
    **/
    create<T extends GasSlipApproverCreateArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverCreateArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many GasSlipApprovers.
     *     @param {GasSlipApproverCreateManyArgs} args - Arguments to create many GasSlipApprovers.
     *     @example
     *     // Create many GasSlipApprovers
     *     const gasSlipApprover = await prisma.gasSlipApprover.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends GasSlipApproverCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GasSlipApprover.
     * @param {GasSlipApproverDeleteArgs} args - Arguments to delete one GasSlipApprover.
     * @example
     * // Delete one GasSlipApprover
     * const GasSlipApprover = await prisma.gasSlipApprover.delete({
     *   where: {
     *     // ... filter to delete one GasSlipApprover
     *   }
     * })
     * 
    **/
    delete<T extends GasSlipApproverDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverDeleteArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one GasSlipApprover.
     * @param {GasSlipApproverUpdateArgs} args - Arguments to update one GasSlipApprover.
     * @example
     * // Update one GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GasSlipApproverUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverUpdateArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more GasSlipApprovers.
     * @param {GasSlipApproverDeleteManyArgs} args - Arguments to filter GasSlipApprovers to delete.
     * @example
     * // Delete a few GasSlipApprovers
     * const { count } = await prisma.gasSlipApprover.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GasSlipApproverDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasSlipApproverDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GasSlipApprovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GasSlipApprovers
     * const gasSlipApprover = await prisma.gasSlipApprover.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GasSlipApproverUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GasSlipApprover.
     * @param {GasSlipApproverUpsertArgs} args - Arguments to update or create a GasSlipApprover.
     * @example
     * // Update or create a GasSlipApprover
     * const gasSlipApprover = await prisma.gasSlipApprover.upsert({
     *   create: {
     *     // ... data to create a GasSlipApprover
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GasSlipApprover we want to update
     *   }
     * })
    **/
    upsert<T extends GasSlipApproverUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, GasSlipApproverUpsertArgs<ExtArgs>>
    ): Prisma__GasSlipApproverClient<$Result.GetResult<Prisma.$GasSlipApproverPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of GasSlipApprovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverCountArgs} args - Arguments to filter GasSlipApprovers to count.
     * @example
     * // Count the number of GasSlipApprovers
     * const count = await prisma.gasSlipApprover.count({
     *   where: {
     *     // ... the filter for the GasSlipApprovers we want to count
     *   }
     * })
    **/
    count<T extends GasSlipApproverCountArgs>(
      args?: Subset<T, GasSlipApproverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GasSlipApproverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GasSlipApprover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GasSlipApproverAggregateArgs>(args: Subset<T, GasSlipApproverAggregateArgs>): Prisma.PrismaPromise<GetGasSlipApproverAggregateType<T>>

    /**
     * Group by GasSlipApprover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasSlipApproverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GasSlipApproverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GasSlipApproverGroupByArgs['orderBy'] }
        : { orderBy?: GasSlipApproverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GasSlipApproverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGasSlipApproverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GasSlipApprover model
   */
  readonly fields: GasSlipApproverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GasSlipApprover.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GasSlipApproverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    gas_slip<T extends GasSlipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GasSlipDefaultArgs<ExtArgs>>): Prisma__GasSlipClient<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the GasSlipApprover model
   */ 
  interface GasSlipApproverFieldRefs {
    readonly id: FieldRef<"GasSlipApprover", 'String'>
    readonly gas_slip_id: FieldRef<"GasSlipApprover", 'String'>
    readonly approver_id: FieldRef<"GasSlipApprover", 'String'>
    readonly date_approval: FieldRef<"GasSlipApprover", 'DateTime'>
    readonly notes: FieldRef<"GasSlipApprover", 'String'>
    readonly status: FieldRef<"GasSlipApprover", 'Int'>
    readonly label: FieldRef<"GasSlipApprover", 'String'>
    readonly order: FieldRef<"GasSlipApprover", 'Int'>
    readonly updated_by: FieldRef<"GasSlipApprover", 'String'>
    readonly updated_at: FieldRef<"GasSlipApprover", 'DateTime'>
    readonly metadata: FieldRef<"GasSlipApprover", 'Json'>
  }
    

  // Custom InputTypes

  /**
   * GasSlipApprover findUnique
   */
  export type GasSlipApproverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter, which GasSlipApprover to fetch.
     */
    where: GasSlipApproverWhereUniqueInput
  }


  /**
   * GasSlipApprover findUniqueOrThrow
   */
  export type GasSlipApproverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter, which GasSlipApprover to fetch.
     */
    where: GasSlipApproverWhereUniqueInput
  }


  /**
   * GasSlipApprover findFirst
   */
  export type GasSlipApproverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter, which GasSlipApprover to fetch.
     */
    where?: GasSlipApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlipApprovers to fetch.
     */
    orderBy?: GasSlipApproverOrderByWithRelationInput | GasSlipApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasSlipApprovers.
     */
    cursor?: GasSlipApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlipApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlipApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasSlipApprovers.
     */
    distinct?: GasSlipApproverScalarFieldEnum | GasSlipApproverScalarFieldEnum[]
  }


  /**
   * GasSlipApprover findFirstOrThrow
   */
  export type GasSlipApproverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter, which GasSlipApprover to fetch.
     */
    where?: GasSlipApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlipApprovers to fetch.
     */
    orderBy?: GasSlipApproverOrderByWithRelationInput | GasSlipApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasSlipApprovers.
     */
    cursor?: GasSlipApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlipApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlipApprovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasSlipApprovers.
     */
    distinct?: GasSlipApproverScalarFieldEnum | GasSlipApproverScalarFieldEnum[]
  }


  /**
   * GasSlipApprover findMany
   */
  export type GasSlipApproverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter, which GasSlipApprovers to fetch.
     */
    where?: GasSlipApproverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasSlipApprovers to fetch.
     */
    orderBy?: GasSlipApproverOrderByWithRelationInput | GasSlipApproverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GasSlipApprovers.
     */
    cursor?: GasSlipApproverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasSlipApprovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasSlipApprovers.
     */
    skip?: number
    distinct?: GasSlipApproverScalarFieldEnum | GasSlipApproverScalarFieldEnum[]
  }


  /**
   * GasSlipApprover create
   */
  export type GasSlipApproverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * The data needed to create a GasSlipApprover.
     */
    data: XOR<GasSlipApproverCreateInput, GasSlipApproverUncheckedCreateInput>
  }


  /**
   * GasSlipApprover createMany
   */
  export type GasSlipApproverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GasSlipApprovers.
     */
    data: GasSlipApproverCreateManyInput | GasSlipApproverCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * GasSlipApprover update
   */
  export type GasSlipApproverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * The data needed to update a GasSlipApprover.
     */
    data: XOR<GasSlipApproverUpdateInput, GasSlipApproverUncheckedUpdateInput>
    /**
     * Choose, which GasSlipApprover to update.
     */
    where: GasSlipApproverWhereUniqueInput
  }


  /**
   * GasSlipApprover updateMany
   */
  export type GasSlipApproverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GasSlipApprovers.
     */
    data: XOR<GasSlipApproverUpdateManyMutationInput, GasSlipApproverUncheckedUpdateManyInput>
    /**
     * Filter which GasSlipApprovers to update
     */
    where?: GasSlipApproverWhereInput
  }


  /**
   * GasSlipApprover upsert
   */
  export type GasSlipApproverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * The filter to search for the GasSlipApprover to update in case it exists.
     */
    where: GasSlipApproverWhereUniqueInput
    /**
     * In case the GasSlipApprover found by the `where` argument doesn't exist, create a new GasSlipApprover with this data.
     */
    create: XOR<GasSlipApproverCreateInput, GasSlipApproverUncheckedCreateInput>
    /**
     * In case the GasSlipApprover was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GasSlipApproverUpdateInput, GasSlipApproverUncheckedUpdateInput>
  }


  /**
   * GasSlipApprover delete
   */
  export type GasSlipApproverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
    /**
     * Filter which GasSlipApprover to delete.
     */
    where: GasSlipApproverWhereUniqueInput
  }


  /**
   * GasSlipApprover deleteMany
   */
  export type GasSlipApproverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasSlipApprovers to delete
     */
    where?: GasSlipApproverWhereInput
  }


  /**
   * GasSlipApprover without action
   */
  export type GasSlipApproverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlipApprover
     */
    select?: GasSlipApproverSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipApproverInclude<ExtArgs> | null
  }



  /**
   * Model GasStation
   */

  export type AggregateGasStation = {
    _count: GasStationCountAggregateOutputType | null
    _avg: GasStationAvgAggregateOutputType | null
    _sum: GasStationSumAggregateOutputType | null
    _min: GasStationMinAggregateOutputType | null
    _max: GasStationMaxAggregateOutputType | null
  }

  export type GasStationAvgAggregateOutputType = {
    id: number | null
  }

  export type GasStationSumAggregateOutputType = {
    id: number | null
  }

  export type GasStationMinAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    contact_number: string | null
  }

  export type GasStationMaxAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    contact_number: string | null
  }

  export type GasStationCountAggregateOutputType = {
    id: number
    name: number
    location: number
    contact_number: number
    _all: number
  }


  export type GasStationAvgAggregateInputType = {
    id?: true
  }

  export type GasStationSumAggregateInputType = {
    id?: true
  }

  export type GasStationMinAggregateInputType = {
    id?: true
    name?: true
    location?: true
    contact_number?: true
  }

  export type GasStationMaxAggregateInputType = {
    id?: true
    name?: true
    location?: true
    contact_number?: true
  }

  export type GasStationCountAggregateInputType = {
    id?: true
    name?: true
    location?: true
    contact_number?: true
    _all?: true
  }

  export type GasStationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasStation to aggregate.
     */
    where?: GasStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasStations to fetch.
     */
    orderBy?: GasStationOrderByWithRelationInput | GasStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GasStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GasStations
    **/
    _count?: true | GasStationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GasStationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GasStationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GasStationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GasStationMaxAggregateInputType
  }

  export type GetGasStationAggregateType<T extends GasStationAggregateArgs> = {
        [P in keyof T & keyof AggregateGasStation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGasStation[P]>
      : GetScalarType<T[P], AggregateGasStation[P]>
  }




  export type GasStationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GasStationWhereInput
    orderBy?: GasStationOrderByWithAggregationInput | GasStationOrderByWithAggregationInput[]
    by: GasStationScalarFieldEnum[] | GasStationScalarFieldEnum
    having?: GasStationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GasStationCountAggregateInputType | true
    _avg?: GasStationAvgAggregateInputType
    _sum?: GasStationSumAggregateInputType
    _min?: GasStationMinAggregateInputType
    _max?: GasStationMaxAggregateInputType
  }

  export type GasStationGroupByOutputType = {
    id: number
    name: string
    location: string
    contact_number: string
    _count: GasStationCountAggregateOutputType | null
    _avg: GasStationAvgAggregateOutputType | null
    _sum: GasStationSumAggregateOutputType | null
    _min: GasStationMinAggregateOutputType | null
    _max: GasStationMaxAggregateOutputType | null
  }

  type GetGasStationGroupByPayload<T extends GasStationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GasStationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GasStationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GasStationGroupByOutputType[P]>
            : GetScalarType<T[P], GasStationGroupByOutputType[P]>
        }
      >
    >


  export type GasStationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    location?: boolean
    contact_number?: boolean
    gas_slips?: boolean | GasStation$gas_slipsArgs<ExtArgs>
    _count?: boolean | GasStationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gasStation"]>

  export type GasStationSelectScalar = {
    id?: boolean
    name?: boolean
    location?: boolean
    contact_number?: boolean
  }

  export type GasStationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slips?: boolean | GasStation$gas_slipsArgs<ExtArgs>
    _count?: boolean | GasStationCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $GasStationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GasStation"
    objects: {
      gas_slips: Prisma.$GasSlipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      location: string
      contact_number: string
    }, ExtArgs["result"]["gasStation"]>
    composites: {}
  }


  type GasStationGetPayload<S extends boolean | null | undefined | GasStationDefaultArgs> = $Result.GetResult<Prisma.$GasStationPayload, S>

  type GasStationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GasStationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GasStationCountAggregateInputType | true
    }

  export interface GasStationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GasStation'], meta: { name: 'GasStation' } }
    /**
     * Find zero or one GasStation that matches the filter.
     * @param {GasStationFindUniqueArgs} args - Arguments to find a GasStation
     * @example
     * // Get one GasStation
     * const gasStation = await prisma.gasStation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends GasStationFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationFindUniqueArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one GasStation that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {GasStationFindUniqueOrThrowArgs} args - Arguments to find a GasStation
     * @example
     * // Get one GasStation
     * const gasStation = await prisma.gasStation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends GasStationFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first GasStation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationFindFirstArgs} args - Arguments to find a GasStation
     * @example
     * // Get one GasStation
     * const gasStation = await prisma.gasStation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends GasStationFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationFindFirstArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first GasStation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationFindFirstOrThrowArgs} args - Arguments to find a GasStation
     * @example
     * // Get one GasStation
     * const gasStation = await prisma.gasStation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends GasStationFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more GasStations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GasStations
     * const gasStations = await prisma.gasStation.findMany()
     * 
     * // Get first 10 GasStations
     * const gasStations = await prisma.gasStation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gasStationWithIdOnly = await prisma.gasStation.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends GasStationFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a GasStation.
     * @param {GasStationCreateArgs} args - Arguments to create a GasStation.
     * @example
     * // Create one GasStation
     * const GasStation = await prisma.gasStation.create({
     *   data: {
     *     // ... data to create a GasStation
     *   }
     * })
     * 
    **/
    create<T extends GasStationCreateArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationCreateArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many GasStations.
     *     @param {GasStationCreateManyArgs} args - Arguments to create many GasStations.
     *     @example
     *     // Create many GasStations
     *     const gasStation = await prisma.gasStation.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends GasStationCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GasStation.
     * @param {GasStationDeleteArgs} args - Arguments to delete one GasStation.
     * @example
     * // Delete one GasStation
     * const GasStation = await prisma.gasStation.delete({
     *   where: {
     *     // ... filter to delete one GasStation
     *   }
     * })
     * 
    **/
    delete<T extends GasStationDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationDeleteArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one GasStation.
     * @param {GasStationUpdateArgs} args - Arguments to update one GasStation.
     * @example
     * // Update one GasStation
     * const gasStation = await prisma.gasStation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GasStationUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationUpdateArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more GasStations.
     * @param {GasStationDeleteManyArgs} args - Arguments to filter GasStations to delete.
     * @example
     * // Delete a few GasStations
     * const { count } = await prisma.gasStation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GasStationDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GasStationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GasStations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GasStations
     * const gasStation = await prisma.gasStation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GasStationUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GasStation.
     * @param {GasStationUpsertArgs} args - Arguments to update or create a GasStation.
     * @example
     * // Update or create a GasStation
     * const gasStation = await prisma.gasStation.upsert({
     *   create: {
     *     // ... data to create a GasStation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GasStation we want to update
     *   }
     * })
    **/
    upsert<T extends GasStationUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, GasStationUpsertArgs<ExtArgs>>
    ): Prisma__GasStationClient<$Result.GetResult<Prisma.$GasStationPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of GasStations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationCountArgs} args - Arguments to filter GasStations to count.
     * @example
     * // Count the number of GasStations
     * const count = await prisma.gasStation.count({
     *   where: {
     *     // ... the filter for the GasStations we want to count
     *   }
     * })
    **/
    count<T extends GasStationCountArgs>(
      args?: Subset<T, GasStationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GasStationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GasStation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GasStationAggregateArgs>(args: Subset<T, GasStationAggregateArgs>): Prisma.PrismaPromise<GetGasStationAggregateType<T>>

    /**
     * Group by GasStation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GasStationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GasStationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GasStationGroupByArgs['orderBy'] }
        : { orderBy?: GasStationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GasStationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGasStationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GasStation model
   */
  readonly fields: GasStationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GasStation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GasStationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    gas_slips<T extends GasStation$gas_slipsArgs<ExtArgs> = {}>(args?: Subset<T, GasStation$gas_slipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the GasStation model
   */ 
  interface GasStationFieldRefs {
    readonly id: FieldRef<"GasStation", 'Int'>
    readonly name: FieldRef<"GasStation", 'String'>
    readonly location: FieldRef<"GasStation", 'String'>
    readonly contact_number: FieldRef<"GasStation", 'String'>
  }
    

  // Custom InputTypes

  /**
   * GasStation findUnique
   */
  export type GasStationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter, which GasStation to fetch.
     */
    where: GasStationWhereUniqueInput
  }


  /**
   * GasStation findUniqueOrThrow
   */
  export type GasStationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter, which GasStation to fetch.
     */
    where: GasStationWhereUniqueInput
  }


  /**
   * GasStation findFirst
   */
  export type GasStationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter, which GasStation to fetch.
     */
    where?: GasStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasStations to fetch.
     */
    orderBy?: GasStationOrderByWithRelationInput | GasStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasStations.
     */
    cursor?: GasStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasStations.
     */
    distinct?: GasStationScalarFieldEnum | GasStationScalarFieldEnum[]
  }


  /**
   * GasStation findFirstOrThrow
   */
  export type GasStationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter, which GasStation to fetch.
     */
    where?: GasStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasStations to fetch.
     */
    orderBy?: GasStationOrderByWithRelationInput | GasStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GasStations.
     */
    cursor?: GasStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GasStations.
     */
    distinct?: GasStationScalarFieldEnum | GasStationScalarFieldEnum[]
  }


  /**
   * GasStation findMany
   */
  export type GasStationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter, which GasStations to fetch.
     */
    where?: GasStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GasStations to fetch.
     */
    orderBy?: GasStationOrderByWithRelationInput | GasStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GasStations.
     */
    cursor?: GasStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GasStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GasStations.
     */
    skip?: number
    distinct?: GasStationScalarFieldEnum | GasStationScalarFieldEnum[]
  }


  /**
   * GasStation create
   */
  export type GasStationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * The data needed to create a GasStation.
     */
    data: XOR<GasStationCreateInput, GasStationUncheckedCreateInput>
  }


  /**
   * GasStation createMany
   */
  export type GasStationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GasStations.
     */
    data: GasStationCreateManyInput | GasStationCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * GasStation update
   */
  export type GasStationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * The data needed to update a GasStation.
     */
    data: XOR<GasStationUpdateInput, GasStationUncheckedUpdateInput>
    /**
     * Choose, which GasStation to update.
     */
    where: GasStationWhereUniqueInput
  }


  /**
   * GasStation updateMany
   */
  export type GasStationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GasStations.
     */
    data: XOR<GasStationUpdateManyMutationInput, GasStationUncheckedUpdateManyInput>
    /**
     * Filter which GasStations to update
     */
    where?: GasStationWhereInput
  }


  /**
   * GasStation upsert
   */
  export type GasStationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * The filter to search for the GasStation to update in case it exists.
     */
    where: GasStationWhereUniqueInput
    /**
     * In case the GasStation found by the `where` argument doesn't exist, create a new GasStation with this data.
     */
    create: XOR<GasStationCreateInput, GasStationUncheckedCreateInput>
    /**
     * In case the GasStation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GasStationUpdateInput, GasStationUncheckedUpdateInput>
  }


  /**
   * GasStation delete
   */
  export type GasStationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
    /**
     * Filter which GasStation to delete.
     */
    where: GasStationWhereUniqueInput
  }


  /**
   * GasStation deleteMany
   */
  export type GasStationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GasStations to delete
     */
    where?: GasStationWhereInput
  }


  /**
   * GasStation.gas_slips
   */
  export type GasStation$gas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    where?: GasSlipWhereInput
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    cursor?: GasSlipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * GasStation without action
   */
  export type GasStationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasStation
     */
    select?: GasStationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasStationInclude<ExtArgs> | null
  }



  /**
   * Model FuelType
   */

  export type AggregateFuelType = {
    _count: FuelTypeCountAggregateOutputType | null
    _avg: FuelTypeAvgAggregateOutputType | null
    _sum: FuelTypeSumAggregateOutputType | null
    _min: FuelTypeMinAggregateOutputType | null
    _max: FuelTypeMaxAggregateOutputType | null
  }

  export type FuelTypeAvgAggregateOutputType = {
    id: number | null
  }

  export type FuelTypeSumAggregateOutputType = {
    id: number | null
  }

  export type FuelTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type FuelTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type FuelTypeCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type FuelTypeAvgAggregateInputType = {
    id?: true
  }

  export type FuelTypeSumAggregateInputType = {
    id?: true
  }

  export type FuelTypeMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type FuelTypeMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type FuelTypeCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type FuelTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FuelType to aggregate.
     */
    where?: FuelTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FuelTypes to fetch.
     */
    orderBy?: FuelTypeOrderByWithRelationInput | FuelTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FuelTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FuelTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FuelTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FuelTypes
    **/
    _count?: true | FuelTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FuelTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FuelTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FuelTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FuelTypeMaxAggregateInputType
  }

  export type GetFuelTypeAggregateType<T extends FuelTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateFuelType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFuelType[P]>
      : GetScalarType<T[P], AggregateFuelType[P]>
  }




  export type FuelTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FuelTypeWhereInput
    orderBy?: FuelTypeOrderByWithAggregationInput | FuelTypeOrderByWithAggregationInput[]
    by: FuelTypeScalarFieldEnum[] | FuelTypeScalarFieldEnum
    having?: FuelTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FuelTypeCountAggregateInputType | true
    _avg?: FuelTypeAvgAggregateInputType
    _sum?: FuelTypeSumAggregateInputType
    _min?: FuelTypeMinAggregateInputType
    _max?: FuelTypeMaxAggregateInputType
  }

  export type FuelTypeGroupByOutputType = {
    id: number
    name: string
    _count: FuelTypeCountAggregateOutputType | null
    _avg: FuelTypeAvgAggregateOutputType | null
    _sum: FuelTypeSumAggregateOutputType | null
    _min: FuelTypeMinAggregateOutputType | null
    _max: FuelTypeMaxAggregateOutputType | null
  }

  type GetFuelTypeGroupByPayload<T extends FuelTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FuelTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FuelTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FuelTypeGroupByOutputType[P]>
            : GetScalarType<T[P], FuelTypeGroupByOutputType[P]>
        }
      >
    >


  export type FuelTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gas_slips?: boolean | FuelType$gas_slipsArgs<ExtArgs>
    _count?: boolean | FuelTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fuelType"]>

  export type FuelTypeSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type FuelTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gas_slips?: boolean | FuelType$gas_slipsArgs<ExtArgs>
    _count?: boolean | FuelTypeCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $FuelTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FuelType"
    objects: {
      gas_slips: Prisma.$GasSlipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["fuelType"]>
    composites: {}
  }


  type FuelTypeGetPayload<S extends boolean | null | undefined | FuelTypeDefaultArgs> = $Result.GetResult<Prisma.$FuelTypePayload, S>

  type FuelTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FuelTypeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FuelTypeCountAggregateInputType | true
    }

  export interface FuelTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FuelType'], meta: { name: 'FuelType' } }
    /**
     * Find zero or one FuelType that matches the filter.
     * @param {FuelTypeFindUniqueArgs} args - Arguments to find a FuelType
     * @example
     * // Get one FuelType
     * const fuelType = await prisma.fuelType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FuelTypeFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeFindUniqueArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one FuelType that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FuelTypeFindUniqueOrThrowArgs} args - Arguments to find a FuelType
     * @example
     * // Get one FuelType
     * const fuelType = await prisma.fuelType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FuelTypeFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first FuelType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeFindFirstArgs} args - Arguments to find a FuelType
     * @example
     * // Get one FuelType
     * const fuelType = await prisma.fuelType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FuelTypeFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeFindFirstArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first FuelType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeFindFirstOrThrowArgs} args - Arguments to find a FuelType
     * @example
     * // Get one FuelType
     * const fuelType = await prisma.fuelType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FuelTypeFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more FuelTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FuelTypes
     * const fuelTypes = await prisma.fuelType.findMany()
     * 
     * // Get first 10 FuelTypes
     * const fuelTypes = await prisma.fuelType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fuelTypeWithIdOnly = await prisma.fuelType.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FuelTypeFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a FuelType.
     * @param {FuelTypeCreateArgs} args - Arguments to create a FuelType.
     * @example
     * // Create one FuelType
     * const FuelType = await prisma.fuelType.create({
     *   data: {
     *     // ... data to create a FuelType
     *   }
     * })
     * 
    **/
    create<T extends FuelTypeCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeCreateArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many FuelTypes.
     *     @param {FuelTypeCreateManyArgs} args - Arguments to create many FuelTypes.
     *     @example
     *     // Create many FuelTypes
     *     const fuelType = await prisma.fuelType.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FuelTypeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FuelType.
     * @param {FuelTypeDeleteArgs} args - Arguments to delete one FuelType.
     * @example
     * // Delete one FuelType
     * const FuelType = await prisma.fuelType.delete({
     *   where: {
     *     // ... filter to delete one FuelType
     *   }
     * })
     * 
    **/
    delete<T extends FuelTypeDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeDeleteArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one FuelType.
     * @param {FuelTypeUpdateArgs} args - Arguments to update one FuelType.
     * @example
     * // Update one FuelType
     * const fuelType = await prisma.fuelType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FuelTypeUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeUpdateArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more FuelTypes.
     * @param {FuelTypeDeleteManyArgs} args - Arguments to filter FuelTypes to delete.
     * @example
     * // Delete a few FuelTypes
     * const { count } = await prisma.fuelType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FuelTypeDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FuelTypeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FuelTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FuelTypes
     * const fuelType = await prisma.fuelType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FuelTypeUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FuelType.
     * @param {FuelTypeUpsertArgs} args - Arguments to update or create a FuelType.
     * @example
     * // Update or create a FuelType
     * const fuelType = await prisma.fuelType.upsert({
     *   create: {
     *     // ... data to create a FuelType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FuelType we want to update
     *   }
     * })
    **/
    upsert<T extends FuelTypeUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FuelTypeUpsertArgs<ExtArgs>>
    ): Prisma__FuelTypeClient<$Result.GetResult<Prisma.$FuelTypePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of FuelTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeCountArgs} args - Arguments to filter FuelTypes to count.
     * @example
     * // Count the number of FuelTypes
     * const count = await prisma.fuelType.count({
     *   where: {
     *     // ... the filter for the FuelTypes we want to count
     *   }
     * })
    **/
    count<T extends FuelTypeCountArgs>(
      args?: Subset<T, FuelTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FuelTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FuelType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FuelTypeAggregateArgs>(args: Subset<T, FuelTypeAggregateArgs>): Prisma.PrismaPromise<GetFuelTypeAggregateType<T>>

    /**
     * Group by FuelType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuelTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FuelTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FuelTypeGroupByArgs['orderBy'] }
        : { orderBy?: FuelTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FuelTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFuelTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FuelType model
   */
  readonly fields: FuelTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FuelType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FuelTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    gas_slips<T extends FuelType$gas_slipsArgs<ExtArgs> = {}>(args?: Subset<T, FuelType$gas_slipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GasSlipPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the FuelType model
   */ 
  interface FuelTypeFieldRefs {
    readonly id: FieldRef<"FuelType", 'Int'>
    readonly name: FieldRef<"FuelType", 'String'>
  }
    

  // Custom InputTypes

  /**
   * FuelType findUnique
   */
  export type FuelTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter, which FuelType to fetch.
     */
    where: FuelTypeWhereUniqueInput
  }


  /**
   * FuelType findUniqueOrThrow
   */
  export type FuelTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter, which FuelType to fetch.
     */
    where: FuelTypeWhereUniqueInput
  }


  /**
   * FuelType findFirst
   */
  export type FuelTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter, which FuelType to fetch.
     */
    where?: FuelTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FuelTypes to fetch.
     */
    orderBy?: FuelTypeOrderByWithRelationInput | FuelTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FuelTypes.
     */
    cursor?: FuelTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FuelTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FuelTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FuelTypes.
     */
    distinct?: FuelTypeScalarFieldEnum | FuelTypeScalarFieldEnum[]
  }


  /**
   * FuelType findFirstOrThrow
   */
  export type FuelTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter, which FuelType to fetch.
     */
    where?: FuelTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FuelTypes to fetch.
     */
    orderBy?: FuelTypeOrderByWithRelationInput | FuelTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FuelTypes.
     */
    cursor?: FuelTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FuelTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FuelTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FuelTypes.
     */
    distinct?: FuelTypeScalarFieldEnum | FuelTypeScalarFieldEnum[]
  }


  /**
   * FuelType findMany
   */
  export type FuelTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter, which FuelTypes to fetch.
     */
    where?: FuelTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FuelTypes to fetch.
     */
    orderBy?: FuelTypeOrderByWithRelationInput | FuelTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FuelTypes.
     */
    cursor?: FuelTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FuelTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FuelTypes.
     */
    skip?: number
    distinct?: FuelTypeScalarFieldEnum | FuelTypeScalarFieldEnum[]
  }


  /**
   * FuelType create
   */
  export type FuelTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a FuelType.
     */
    data: XOR<FuelTypeCreateInput, FuelTypeUncheckedCreateInput>
  }


  /**
   * FuelType createMany
   */
  export type FuelTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FuelTypes.
     */
    data: FuelTypeCreateManyInput | FuelTypeCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * FuelType update
   */
  export type FuelTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a FuelType.
     */
    data: XOR<FuelTypeUpdateInput, FuelTypeUncheckedUpdateInput>
    /**
     * Choose, which FuelType to update.
     */
    where: FuelTypeWhereUniqueInput
  }


  /**
   * FuelType updateMany
   */
  export type FuelTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FuelTypes.
     */
    data: XOR<FuelTypeUpdateManyMutationInput, FuelTypeUncheckedUpdateManyInput>
    /**
     * Filter which FuelTypes to update
     */
    where?: FuelTypeWhereInput
  }


  /**
   * FuelType upsert
   */
  export type FuelTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the FuelType to update in case it exists.
     */
    where: FuelTypeWhereUniqueInput
    /**
     * In case the FuelType found by the `where` argument doesn't exist, create a new FuelType with this data.
     */
    create: XOR<FuelTypeCreateInput, FuelTypeUncheckedCreateInput>
    /**
     * In case the FuelType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FuelTypeUpdateInput, FuelTypeUncheckedUpdateInput>
  }


  /**
   * FuelType delete
   */
  export type FuelTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
    /**
     * Filter which FuelType to delete.
     */
    where: FuelTypeWhereUniqueInput
  }


  /**
   * FuelType deleteMany
   */
  export type FuelTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FuelTypes to delete
     */
    where?: FuelTypeWhereInput
  }


  /**
   * FuelType.gas_slips
   */
  export type FuelType$gas_slipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GasSlip
     */
    select?: GasSlipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GasSlipInclude<ExtArgs> | null
    where?: GasSlipWhereInput
    orderBy?: GasSlipOrderByWithRelationInput | GasSlipOrderByWithRelationInput[]
    cursor?: GasSlipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GasSlipScalarFieldEnum | GasSlipScalarFieldEnum[]
  }


  /**
   * FuelType without action
   */
  export type FuelTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuelType
     */
    select?: FuelTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FuelTypeInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const VehicleScalarFieldEnum: {
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

  export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum]


  export const TripTicketScalarFieldEnum: {
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

  export type TripTicketScalarFieldEnum = (typeof TripTicketScalarFieldEnum)[keyof typeof TripTicketScalarFieldEnum]


  export const TripTicketApproverScalarFieldEnum: {
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

  export type TripTicketApproverScalarFieldEnum = (typeof TripTicketApproverScalarFieldEnum)[keyof typeof TripTicketApproverScalarFieldEnum]


  export const GasSlipScalarFieldEnum: {
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

  export type GasSlipScalarFieldEnum = (typeof GasSlipScalarFieldEnum)[keyof typeof GasSlipScalarFieldEnum]


  export const GasSlipApproverScalarFieldEnum: {
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

  export type GasSlipApproverScalarFieldEnum = (typeof GasSlipApproverScalarFieldEnum)[keyof typeof GasSlipApproverScalarFieldEnum]


  export const GasStationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    location: 'location',
    contact_number: 'contact_number'
  };

  export type GasStationScalarFieldEnum = (typeof GasStationScalarFieldEnum)[keyof typeof GasStationScalarFieldEnum]


  export const FuelTypeScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type FuelTypeScalarFieldEnum = (typeof FuelTypeScalarFieldEnum)[keyof typeof FuelTypeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type VehicleWhereInput = {
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    id?: StringFilter<"Vehicle"> | string
    vehicle_number?: StringFilter<"Vehicle"> | string
    plate_number?: StringFilter<"Vehicle"> | string
    rf_id?: StringFilter<"Vehicle"> | string
    classification_id?: IntFilter<"Vehicle"> | number
    assignee_id?: StringFilter<"Vehicle"> | string
    name?: StringFilter<"Vehicle"> | string
    date_acquired?: DateTimeFilter<"Vehicle"> | Date | string
    status?: IntFilter<"Vehicle"> | number
    created_by?: StringFilter<"Vehicle"> | string
    updated_by?: StringNullableFilter<"Vehicle"> | string | null
    created_at?: DateTimeFilter<"Vehicle"> | Date | string
    updated_at?: DateTimeFilter<"Vehicle"> | Date | string
    trip_tickets?: TripTicketListRelationFilter
    gas_slips?: GasSlipListRelationFilter
  }

  export type VehicleOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_number?: SortOrder
    plate_number?: SortOrder
    rf_id?: SortOrder
    classification_id?: SortOrder
    assignee_id?: SortOrder
    name?: SortOrder
    date_acquired?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    trip_tickets?: TripTicketOrderByRelationAggregateInput
    gas_slips?: GasSlipOrderByRelationAggregateInput
  }

  export type VehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    vehicle_number?: string
    plate_number?: string
    rf_id?: string
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    classification_id?: IntFilter<"Vehicle"> | number
    assignee_id?: StringFilter<"Vehicle"> | string
    name?: StringFilter<"Vehicle"> | string
    date_acquired?: DateTimeFilter<"Vehicle"> | Date | string
    status?: IntFilter<"Vehicle"> | number
    created_by?: StringFilter<"Vehicle"> | string
    updated_by?: StringNullableFilter<"Vehicle"> | string | null
    created_at?: DateTimeFilter<"Vehicle"> | Date | string
    updated_at?: DateTimeFilter<"Vehicle"> | Date | string
    trip_tickets?: TripTicketListRelationFilter
    gas_slips?: GasSlipListRelationFilter
  }, "id" | "vehicle_number" | "plate_number" | "rf_id">

  export type VehicleOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_number?: SortOrder
    plate_number?: SortOrder
    rf_id?: SortOrder
    classification_id?: SortOrder
    assignee_id?: SortOrder
    name?: SortOrder
    date_acquired?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: VehicleCountOrderByAggregateInput
    _avg?: VehicleAvgOrderByAggregateInput
    _max?: VehicleMaxOrderByAggregateInput
    _min?: VehicleMinOrderByAggregateInput
    _sum?: VehicleSumOrderByAggregateInput
  }

  export type VehicleScalarWhereWithAggregatesInput = {
    AND?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    OR?: VehicleScalarWhereWithAggregatesInput[]
    NOT?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vehicle"> | string
    vehicle_number?: StringWithAggregatesFilter<"Vehicle"> | string
    plate_number?: StringWithAggregatesFilter<"Vehicle"> | string
    rf_id?: StringWithAggregatesFilter<"Vehicle"> | string
    classification_id?: IntWithAggregatesFilter<"Vehicle"> | number
    assignee_id?: StringWithAggregatesFilter<"Vehicle"> | string
    name?: StringWithAggregatesFilter<"Vehicle"> | string
    date_acquired?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    status?: IntWithAggregatesFilter<"Vehicle"> | number
    created_by?: StringWithAggregatesFilter<"Vehicle"> | string
    updated_by?: StringNullableWithAggregatesFilter<"Vehicle"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
  }

  export type TripTicketWhereInput = {
    AND?: TripTicketWhereInput | TripTicketWhereInput[]
    OR?: TripTicketWhereInput[]
    NOT?: TripTicketWhereInput | TripTicketWhereInput[]
    id?: StringFilter<"TripTicket"> | string
    vehicle_id?: StringFilter<"TripTicket"> | string
    driver_id?: StringFilter<"TripTicket"> | string
    passengers?: StringFilter<"TripTicket"> | string
    destination?: StringFilter<"TripTicket"> | string
    purpose?: StringFilter<"TripTicket"> | string
    start_time?: DateTimeFilter<"TripTicket"> | Date | string
    end_time?: DateTimeFilter<"TripTicket"> | Date | string
    actual_start_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    actual_end_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    is_operation?: BoolFilter<"TripTicket"> | boolean
    is_stay_in?: BoolFilter<"TripTicket"> | boolean
    is_personal?: BoolFilter<"TripTicket"> | boolean
    is_out_of_coverage?: BoolFilter<"TripTicket"> | boolean
    prepared_by_id?: StringFilter<"TripTicket"> | string
    status?: IntFilter<"TripTicket"> | number
    cancelled_by?: StringNullableFilter<"TripTicket"> | string | null
    created_by?: StringFilter<"TripTicket"> | string
    updated_by?: StringNullableFilter<"TripTicket"> | string | null
    cancelled_at?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    created_at?: DateTimeFilter<"TripTicket"> | Date | string
    updated_at?: DateTimeFilter<"TripTicket"> | Date | string
    vehicle?: XOR<VehicleRelationFilter, VehicleWhereInput>
    trip_ticket_approvers?: TripTicketApproverListRelationFilter
  }

  export type TripTicketOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    passengers?: SortOrder
    destination?: SortOrder
    purpose?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    actual_start_time?: SortOrderInput | SortOrder
    actual_end_time?: SortOrderInput | SortOrder
    is_operation?: SortOrder
    is_stay_in?: SortOrder
    is_personal?: SortOrder
    is_out_of_coverage?: SortOrder
    prepared_by_id?: SortOrder
    status?: SortOrder
    cancelled_by?: SortOrderInput | SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    vehicle?: VehicleOrderByWithRelationInput
    trip_ticket_approvers?: TripTicketApproverOrderByRelationAggregateInput
  }

  export type TripTicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TripTicketWhereInput | TripTicketWhereInput[]
    OR?: TripTicketWhereInput[]
    NOT?: TripTicketWhereInput | TripTicketWhereInput[]
    vehicle_id?: StringFilter<"TripTicket"> | string
    driver_id?: StringFilter<"TripTicket"> | string
    passengers?: StringFilter<"TripTicket"> | string
    destination?: StringFilter<"TripTicket"> | string
    purpose?: StringFilter<"TripTicket"> | string
    start_time?: DateTimeFilter<"TripTicket"> | Date | string
    end_time?: DateTimeFilter<"TripTicket"> | Date | string
    actual_start_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    actual_end_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    is_operation?: BoolFilter<"TripTicket"> | boolean
    is_stay_in?: BoolFilter<"TripTicket"> | boolean
    is_personal?: BoolFilter<"TripTicket"> | boolean
    is_out_of_coverage?: BoolFilter<"TripTicket"> | boolean
    prepared_by_id?: StringFilter<"TripTicket"> | string
    status?: IntFilter<"TripTicket"> | number
    cancelled_by?: StringNullableFilter<"TripTicket"> | string | null
    created_by?: StringFilter<"TripTicket"> | string
    updated_by?: StringNullableFilter<"TripTicket"> | string | null
    cancelled_at?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    created_at?: DateTimeFilter<"TripTicket"> | Date | string
    updated_at?: DateTimeFilter<"TripTicket"> | Date | string
    vehicle?: XOR<VehicleRelationFilter, VehicleWhereInput>
    trip_ticket_approvers?: TripTicketApproverListRelationFilter
  }, "id">

  export type TripTicketOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    passengers?: SortOrder
    destination?: SortOrder
    purpose?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    actual_start_time?: SortOrderInput | SortOrder
    actual_end_time?: SortOrderInput | SortOrder
    is_operation?: SortOrder
    is_stay_in?: SortOrder
    is_personal?: SortOrder
    is_out_of_coverage?: SortOrder
    prepared_by_id?: SortOrder
    status?: SortOrder
    cancelled_by?: SortOrderInput | SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: TripTicketCountOrderByAggregateInput
    _avg?: TripTicketAvgOrderByAggregateInput
    _max?: TripTicketMaxOrderByAggregateInput
    _min?: TripTicketMinOrderByAggregateInput
    _sum?: TripTicketSumOrderByAggregateInput
  }

  export type TripTicketScalarWhereWithAggregatesInput = {
    AND?: TripTicketScalarWhereWithAggregatesInput | TripTicketScalarWhereWithAggregatesInput[]
    OR?: TripTicketScalarWhereWithAggregatesInput[]
    NOT?: TripTicketScalarWhereWithAggregatesInput | TripTicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TripTicket"> | string
    vehicle_id?: StringWithAggregatesFilter<"TripTicket"> | string
    driver_id?: StringWithAggregatesFilter<"TripTicket"> | string
    passengers?: StringWithAggregatesFilter<"TripTicket"> | string
    destination?: StringWithAggregatesFilter<"TripTicket"> | string
    purpose?: StringWithAggregatesFilter<"TripTicket"> | string
    start_time?: DateTimeWithAggregatesFilter<"TripTicket"> | Date | string
    end_time?: DateTimeWithAggregatesFilter<"TripTicket"> | Date | string
    actual_start_time?: DateTimeNullableWithAggregatesFilter<"TripTicket"> | Date | string | null
    actual_end_time?: DateTimeNullableWithAggregatesFilter<"TripTicket"> | Date | string | null
    is_operation?: BoolWithAggregatesFilter<"TripTicket"> | boolean
    is_stay_in?: BoolWithAggregatesFilter<"TripTicket"> | boolean
    is_personal?: BoolWithAggregatesFilter<"TripTicket"> | boolean
    is_out_of_coverage?: BoolWithAggregatesFilter<"TripTicket"> | boolean
    prepared_by_id?: StringWithAggregatesFilter<"TripTicket"> | string
    status?: IntWithAggregatesFilter<"TripTicket"> | number
    cancelled_by?: StringNullableWithAggregatesFilter<"TripTicket"> | string | null
    created_by?: StringWithAggregatesFilter<"TripTicket"> | string
    updated_by?: StringNullableWithAggregatesFilter<"TripTicket"> | string | null
    cancelled_at?: DateTimeNullableWithAggregatesFilter<"TripTicket"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"TripTicket"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"TripTicket"> | Date | string
  }

  export type TripTicketApproverWhereInput = {
    AND?: TripTicketApproverWhereInput | TripTicketApproverWhereInput[]
    OR?: TripTicketApproverWhereInput[]
    NOT?: TripTicketApproverWhereInput | TripTicketApproverWhereInput[]
    id?: StringFilter<"TripTicketApprover"> | string
    trip_ticket_id?: StringFilter<"TripTicketApprover"> | string
    approver_id?: StringFilter<"TripTicketApprover"> | string
    date_approval?: DateTimeNullableFilter<"TripTicketApprover"> | Date | string | null
    notes?: StringFilter<"TripTicketApprover"> | string
    status?: IntFilter<"TripTicketApprover"> | number
    label?: StringFilter<"TripTicketApprover"> | string
    order?: IntFilter<"TripTicketApprover"> | number
    updated_by?: StringNullableFilter<"TripTicketApprover"> | string | null
    updated_at?: DateTimeFilter<"TripTicketApprover"> | Date | string
    metadata?: JsonNullableFilter<"TripTicketApprover">
    trip_ticket?: XOR<TripTicketRelationFilter, TripTicketWhereInput>
  }

  export type TripTicketApproverOrderByWithRelationInput = {
    id?: SortOrder
    trip_ticket_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrderInput | SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    trip_ticket?: TripTicketOrderByWithRelationInput
  }

  export type TripTicketApproverWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    trip_ticket_id_order?: TripTicketApproverTrip_ticket_idOrderCompoundUniqueInput
    AND?: TripTicketApproverWhereInput | TripTicketApproverWhereInput[]
    OR?: TripTicketApproverWhereInput[]
    NOT?: TripTicketApproverWhereInput | TripTicketApproverWhereInput[]
    trip_ticket_id?: StringFilter<"TripTicketApprover"> | string
    approver_id?: StringFilter<"TripTicketApprover"> | string
    date_approval?: DateTimeNullableFilter<"TripTicketApprover"> | Date | string | null
    notes?: StringFilter<"TripTicketApprover"> | string
    status?: IntFilter<"TripTicketApprover"> | number
    label?: StringFilter<"TripTicketApprover"> | string
    order?: IntFilter<"TripTicketApprover"> | number
    updated_by?: StringNullableFilter<"TripTicketApprover"> | string | null
    updated_at?: DateTimeFilter<"TripTicketApprover"> | Date | string
    metadata?: JsonNullableFilter<"TripTicketApprover">
    trip_ticket?: XOR<TripTicketRelationFilter, TripTicketWhereInput>
  }, "id" | "trip_ticket_id_order">

  export type TripTicketApproverOrderByWithAggregationInput = {
    id?: SortOrder
    trip_ticket_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrderInput | SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: TripTicketApproverCountOrderByAggregateInput
    _avg?: TripTicketApproverAvgOrderByAggregateInput
    _max?: TripTicketApproverMaxOrderByAggregateInput
    _min?: TripTicketApproverMinOrderByAggregateInput
    _sum?: TripTicketApproverSumOrderByAggregateInput
  }

  export type TripTicketApproverScalarWhereWithAggregatesInput = {
    AND?: TripTicketApproverScalarWhereWithAggregatesInput | TripTicketApproverScalarWhereWithAggregatesInput[]
    OR?: TripTicketApproverScalarWhereWithAggregatesInput[]
    NOT?: TripTicketApproverScalarWhereWithAggregatesInput | TripTicketApproverScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TripTicketApprover"> | string
    trip_ticket_id?: StringWithAggregatesFilter<"TripTicketApprover"> | string
    approver_id?: StringWithAggregatesFilter<"TripTicketApprover"> | string
    date_approval?: DateTimeNullableWithAggregatesFilter<"TripTicketApprover"> | Date | string | null
    notes?: StringWithAggregatesFilter<"TripTicketApprover"> | string
    status?: IntWithAggregatesFilter<"TripTicketApprover"> | number
    label?: StringWithAggregatesFilter<"TripTicketApprover"> | string
    order?: IntWithAggregatesFilter<"TripTicketApprover"> | number
    updated_by?: StringNullableWithAggregatesFilter<"TripTicketApprover"> | string | null
    updated_at?: DateTimeWithAggregatesFilter<"TripTicketApprover"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"TripTicketApprover">
  }

  export type GasSlipWhereInput = {
    AND?: GasSlipWhereInput | GasSlipWhereInput[]
    OR?: GasSlipWhereInput[]
    NOT?: GasSlipWhereInput | GasSlipWhereInput[]
    id?: StringFilter<"GasSlip"> | string
    gas_slip_number?: StringFilter<"GasSlip"> | string
    vehicle_id?: StringFilter<"GasSlip"> | string
    driver_id?: StringFilter<"GasSlip"> | string
    gas_station_id?: IntFilter<"GasSlip"> | number
    fuel_type_id?: IntFilter<"GasSlip"> | number
    requested_by_id?: StringFilter<"GasSlip"> | string
    with_container?: BoolFilter<"GasSlip"> | boolean
    liter_in_text?: StringFilter<"GasSlip"> | string
    actual_liter?: FloatNullableFilter<"GasSlip"> | number | null
    price_per_liter?: FloatNullableFilter<"GasSlip"> | number | null
    purpose?: StringFilter<"GasSlip"> | string
    is_posted?: BoolFilter<"GasSlip"> | boolean
    print_count?: IntFilter<"GasSlip"> | number
    cancelled_by?: StringNullableFilter<"GasSlip"> | string | null
    created_by?: StringFilter<"GasSlip"> | string
    updated_by?: StringNullableFilter<"GasSlip"> | string | null
    cancelled_at?: DateTimeNullableFilter<"GasSlip"> | Date | string | null
    created_at?: DateTimeFilter<"GasSlip"> | Date | string
    updated_at?: DateTimeFilter<"GasSlip"> | Date | string
    vehicle?: XOR<VehicleRelationFilter, VehicleWhereInput>
    gas_station?: XOR<GasStationRelationFilter, GasStationWhereInput>
    fuel_type?: XOR<FuelTypeRelationFilter, FuelTypeWhereInput>
    gas_slip_approvers?: GasSlipApproverListRelationFilter
  }

  export type GasSlipOrderByWithRelationInput = {
    id?: SortOrder
    gas_slip_number?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    requested_by_id?: SortOrder
    with_container?: SortOrder
    liter_in_text?: SortOrder
    actual_liter?: SortOrderInput | SortOrder
    price_per_liter?: SortOrderInput | SortOrder
    purpose?: SortOrder
    is_posted?: SortOrder
    print_count?: SortOrder
    cancelled_by?: SortOrderInput | SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    vehicle?: VehicleOrderByWithRelationInput
    gas_station?: GasStationOrderByWithRelationInput
    fuel_type?: FuelTypeOrderByWithRelationInput
    gas_slip_approvers?: GasSlipApproverOrderByRelationAggregateInput
  }

  export type GasSlipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gas_slip_number?: string
    AND?: GasSlipWhereInput | GasSlipWhereInput[]
    OR?: GasSlipWhereInput[]
    NOT?: GasSlipWhereInput | GasSlipWhereInput[]
    vehicle_id?: StringFilter<"GasSlip"> | string
    driver_id?: StringFilter<"GasSlip"> | string
    gas_station_id?: IntFilter<"GasSlip"> | number
    fuel_type_id?: IntFilter<"GasSlip"> | number
    requested_by_id?: StringFilter<"GasSlip"> | string
    with_container?: BoolFilter<"GasSlip"> | boolean
    liter_in_text?: StringFilter<"GasSlip"> | string
    actual_liter?: FloatNullableFilter<"GasSlip"> | number | null
    price_per_liter?: FloatNullableFilter<"GasSlip"> | number | null
    purpose?: StringFilter<"GasSlip"> | string
    is_posted?: BoolFilter<"GasSlip"> | boolean
    print_count?: IntFilter<"GasSlip"> | number
    cancelled_by?: StringNullableFilter<"GasSlip"> | string | null
    created_by?: StringFilter<"GasSlip"> | string
    updated_by?: StringNullableFilter<"GasSlip"> | string | null
    cancelled_at?: DateTimeNullableFilter<"GasSlip"> | Date | string | null
    created_at?: DateTimeFilter<"GasSlip"> | Date | string
    updated_at?: DateTimeFilter<"GasSlip"> | Date | string
    vehicle?: XOR<VehicleRelationFilter, VehicleWhereInput>
    gas_station?: XOR<GasStationRelationFilter, GasStationWhereInput>
    fuel_type?: XOR<FuelTypeRelationFilter, FuelTypeWhereInput>
    gas_slip_approvers?: GasSlipApproverListRelationFilter
  }, "id" | "gas_slip_number">

  export type GasSlipOrderByWithAggregationInput = {
    id?: SortOrder
    gas_slip_number?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    requested_by_id?: SortOrder
    with_container?: SortOrder
    liter_in_text?: SortOrder
    actual_liter?: SortOrderInput | SortOrder
    price_per_liter?: SortOrderInput | SortOrder
    purpose?: SortOrder
    is_posted?: SortOrder
    print_count?: SortOrder
    cancelled_by?: SortOrderInput | SortOrder
    created_by?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: GasSlipCountOrderByAggregateInput
    _avg?: GasSlipAvgOrderByAggregateInput
    _max?: GasSlipMaxOrderByAggregateInput
    _min?: GasSlipMinOrderByAggregateInput
    _sum?: GasSlipSumOrderByAggregateInput
  }

  export type GasSlipScalarWhereWithAggregatesInput = {
    AND?: GasSlipScalarWhereWithAggregatesInput | GasSlipScalarWhereWithAggregatesInput[]
    OR?: GasSlipScalarWhereWithAggregatesInput[]
    NOT?: GasSlipScalarWhereWithAggregatesInput | GasSlipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GasSlip"> | string
    gas_slip_number?: StringWithAggregatesFilter<"GasSlip"> | string
    vehicle_id?: StringWithAggregatesFilter<"GasSlip"> | string
    driver_id?: StringWithAggregatesFilter<"GasSlip"> | string
    gas_station_id?: IntWithAggregatesFilter<"GasSlip"> | number
    fuel_type_id?: IntWithAggregatesFilter<"GasSlip"> | number
    requested_by_id?: StringWithAggregatesFilter<"GasSlip"> | string
    with_container?: BoolWithAggregatesFilter<"GasSlip"> | boolean
    liter_in_text?: StringWithAggregatesFilter<"GasSlip"> | string
    actual_liter?: FloatNullableWithAggregatesFilter<"GasSlip"> | number | null
    price_per_liter?: FloatNullableWithAggregatesFilter<"GasSlip"> | number | null
    purpose?: StringWithAggregatesFilter<"GasSlip"> | string
    is_posted?: BoolWithAggregatesFilter<"GasSlip"> | boolean
    print_count?: IntWithAggregatesFilter<"GasSlip"> | number
    cancelled_by?: StringNullableWithAggregatesFilter<"GasSlip"> | string | null
    created_by?: StringWithAggregatesFilter<"GasSlip"> | string
    updated_by?: StringNullableWithAggregatesFilter<"GasSlip"> | string | null
    cancelled_at?: DateTimeNullableWithAggregatesFilter<"GasSlip"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"GasSlip"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"GasSlip"> | Date | string
  }

  export type GasSlipApproverWhereInput = {
    AND?: GasSlipApproverWhereInput | GasSlipApproverWhereInput[]
    OR?: GasSlipApproverWhereInput[]
    NOT?: GasSlipApproverWhereInput | GasSlipApproverWhereInput[]
    id?: StringFilter<"GasSlipApprover"> | string
    gas_slip_id?: StringFilter<"GasSlipApprover"> | string
    approver_id?: StringFilter<"GasSlipApprover"> | string
    date_approval?: DateTimeNullableFilter<"GasSlipApprover"> | Date | string | null
    notes?: StringFilter<"GasSlipApprover"> | string
    status?: IntFilter<"GasSlipApprover"> | number
    label?: StringFilter<"GasSlipApprover"> | string
    order?: IntFilter<"GasSlipApprover"> | number
    updated_by?: StringNullableFilter<"GasSlipApprover"> | string | null
    updated_at?: DateTimeFilter<"GasSlipApprover"> | Date | string
    metadata?: JsonNullableFilter<"GasSlipApprover">
    gas_slip?: XOR<GasSlipRelationFilter, GasSlipWhereInput>
  }

  export type GasSlipApproverOrderByWithRelationInput = {
    id?: SortOrder
    gas_slip_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrderInput | SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    gas_slip?: GasSlipOrderByWithRelationInput
  }

  export type GasSlipApproverWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gas_slip_id_order?: GasSlipApproverGas_slip_idOrderCompoundUniqueInput
    AND?: GasSlipApproverWhereInput | GasSlipApproverWhereInput[]
    OR?: GasSlipApproverWhereInput[]
    NOT?: GasSlipApproverWhereInput | GasSlipApproverWhereInput[]
    gas_slip_id?: StringFilter<"GasSlipApprover"> | string
    approver_id?: StringFilter<"GasSlipApprover"> | string
    date_approval?: DateTimeNullableFilter<"GasSlipApprover"> | Date | string | null
    notes?: StringFilter<"GasSlipApprover"> | string
    status?: IntFilter<"GasSlipApprover"> | number
    label?: StringFilter<"GasSlipApprover"> | string
    order?: IntFilter<"GasSlipApprover"> | number
    updated_by?: StringNullableFilter<"GasSlipApprover"> | string | null
    updated_at?: DateTimeFilter<"GasSlipApprover"> | Date | string
    metadata?: JsonNullableFilter<"GasSlipApprover">
    gas_slip?: XOR<GasSlipRelationFilter, GasSlipWhereInput>
  }, "id" | "gas_slip_id_order">

  export type GasSlipApproverOrderByWithAggregationInput = {
    id?: SortOrder
    gas_slip_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrderInput | SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: GasSlipApproverCountOrderByAggregateInput
    _avg?: GasSlipApproverAvgOrderByAggregateInput
    _max?: GasSlipApproverMaxOrderByAggregateInput
    _min?: GasSlipApproverMinOrderByAggregateInput
    _sum?: GasSlipApproverSumOrderByAggregateInput
  }

  export type GasSlipApproverScalarWhereWithAggregatesInput = {
    AND?: GasSlipApproverScalarWhereWithAggregatesInput | GasSlipApproverScalarWhereWithAggregatesInput[]
    OR?: GasSlipApproverScalarWhereWithAggregatesInput[]
    NOT?: GasSlipApproverScalarWhereWithAggregatesInput | GasSlipApproverScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GasSlipApprover"> | string
    gas_slip_id?: StringWithAggregatesFilter<"GasSlipApprover"> | string
    approver_id?: StringWithAggregatesFilter<"GasSlipApprover"> | string
    date_approval?: DateTimeNullableWithAggregatesFilter<"GasSlipApprover"> | Date | string | null
    notes?: StringWithAggregatesFilter<"GasSlipApprover"> | string
    status?: IntWithAggregatesFilter<"GasSlipApprover"> | number
    label?: StringWithAggregatesFilter<"GasSlipApprover"> | string
    order?: IntWithAggregatesFilter<"GasSlipApprover"> | number
    updated_by?: StringNullableWithAggregatesFilter<"GasSlipApprover"> | string | null
    updated_at?: DateTimeWithAggregatesFilter<"GasSlipApprover"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"GasSlipApprover">
  }

  export type GasStationWhereInput = {
    AND?: GasStationWhereInput | GasStationWhereInput[]
    OR?: GasStationWhereInput[]
    NOT?: GasStationWhereInput | GasStationWhereInput[]
    id?: IntFilter<"GasStation"> | number
    name?: StringFilter<"GasStation"> | string
    location?: StringFilter<"GasStation"> | string
    contact_number?: StringFilter<"GasStation"> | string
    gas_slips?: GasSlipListRelationFilter
  }

  export type GasStationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    contact_number?: SortOrder
    gas_slips?: GasSlipOrderByRelationAggregateInput
  }

  export type GasStationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GasStationWhereInput | GasStationWhereInput[]
    OR?: GasStationWhereInput[]
    NOT?: GasStationWhereInput | GasStationWhereInput[]
    name?: StringFilter<"GasStation"> | string
    location?: StringFilter<"GasStation"> | string
    contact_number?: StringFilter<"GasStation"> | string
    gas_slips?: GasSlipListRelationFilter
  }, "id">

  export type GasStationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    contact_number?: SortOrder
    _count?: GasStationCountOrderByAggregateInput
    _avg?: GasStationAvgOrderByAggregateInput
    _max?: GasStationMaxOrderByAggregateInput
    _min?: GasStationMinOrderByAggregateInput
    _sum?: GasStationSumOrderByAggregateInput
  }

  export type GasStationScalarWhereWithAggregatesInput = {
    AND?: GasStationScalarWhereWithAggregatesInput | GasStationScalarWhereWithAggregatesInput[]
    OR?: GasStationScalarWhereWithAggregatesInput[]
    NOT?: GasStationScalarWhereWithAggregatesInput | GasStationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GasStation"> | number
    name?: StringWithAggregatesFilter<"GasStation"> | string
    location?: StringWithAggregatesFilter<"GasStation"> | string
    contact_number?: StringWithAggregatesFilter<"GasStation"> | string
  }

  export type FuelTypeWhereInput = {
    AND?: FuelTypeWhereInput | FuelTypeWhereInput[]
    OR?: FuelTypeWhereInput[]
    NOT?: FuelTypeWhereInput | FuelTypeWhereInput[]
    id?: IntFilter<"FuelType"> | number
    name?: StringFilter<"FuelType"> | string
    gas_slips?: GasSlipListRelationFilter
  }

  export type FuelTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gas_slips?: GasSlipOrderByRelationAggregateInput
  }

  export type FuelTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FuelTypeWhereInput | FuelTypeWhereInput[]
    OR?: FuelTypeWhereInput[]
    NOT?: FuelTypeWhereInput | FuelTypeWhereInput[]
    name?: StringFilter<"FuelType"> | string
    gas_slips?: GasSlipListRelationFilter
  }, "id">

  export type FuelTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: FuelTypeCountOrderByAggregateInput
    _avg?: FuelTypeAvgOrderByAggregateInput
    _max?: FuelTypeMaxOrderByAggregateInput
    _min?: FuelTypeMinOrderByAggregateInput
    _sum?: FuelTypeSumOrderByAggregateInput
  }

  export type FuelTypeScalarWhereWithAggregatesInput = {
    AND?: FuelTypeScalarWhereWithAggregatesInput | FuelTypeScalarWhereWithAggregatesInput[]
    OR?: FuelTypeScalarWhereWithAggregatesInput[]
    NOT?: FuelTypeScalarWhereWithAggregatesInput | FuelTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FuelType"> | number
    name?: StringWithAggregatesFilter<"FuelType"> | string
  }

  export type VehicleCreateInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_tickets?: TripTicketCreateNestedManyWithoutVehicleInput
    gas_slips?: GasSlipCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_tickets?: TripTicketUncheckedCreateNestedManyWithoutVehicleInput
    gas_slips?: GasSlipUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_tickets?: TripTicketUpdateManyWithoutVehicleNestedInput
    gas_slips?: GasSlipUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_tickets?: TripTicketUncheckedUpdateManyWithoutVehicleNestedInput
    gas_slips?: GasSlipUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateManyInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type VehicleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TripTicketCreateInput = {
    id?: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutTrip_ticketsInput
    trip_ticket_approvers?: TripTicketApproverCreateNestedManyWithoutTrip_ticketInput
  }

  export type TripTicketUncheckedCreateInput = {
    id?: string
    vehicle_id: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_ticket_approvers?: TripTicketApproverUncheckedCreateNestedManyWithoutTrip_ticketInput
  }

  export type TripTicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutTrip_ticketsNestedInput
    trip_ticket_approvers?: TripTicketApproverUpdateManyWithoutTrip_ticketNestedInput
  }

  export type TripTicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_ticket_approvers?: TripTicketApproverUncheckedUpdateManyWithoutTrip_ticketNestedInput
  }

  export type TripTicketCreateManyInput = {
    id?: string
    vehicle_id: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TripTicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TripTicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TripTicketApproverCreateInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    trip_ticket: TripTicketCreateNestedOneWithoutTrip_ticket_approversInput
  }

  export type TripTicketApproverUncheckedCreateInput = {
    id?: string
    trip_ticket_id: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    trip_ticket?: TripTicketUpdateOneRequiredWithoutTrip_ticket_approversNestedInput
  }

  export type TripTicketApproverUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trip_ticket_id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverCreateManyInput = {
    id?: string
    trip_ticket_id: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    trip_ticket_id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipCreateInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutGas_slipsInput
    gas_station: GasStationCreateNestedOneWithoutGas_slipsInput
    fuel_type: FuelTypeCreateNestedOneWithoutGas_slipsInput
    gas_slip_approvers?: GasSlipApproverCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipUncheckedCreateInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_station?: GasStationUpdateOneRequiredWithoutGas_slipsNestedInput
    fuel_type?: FuelTypeUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_slip_approvers?: GasSlipApproverUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipCreateManyInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GasSlipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GasSlipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GasSlipApproverCreateInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    gas_slip: GasSlipCreateNestedOneWithoutGas_slip_approversInput
  }

  export type GasSlipApproverUncheckedCreateInput = {
    id?: string
    gas_slip_id: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    gas_slip?: GasSlipUpdateOneRequiredWithoutGas_slip_approversNestedInput
  }

  export type GasSlipApproverUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverCreateManyInput = {
    id?: string
    gas_slip_id: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasStationCreateInput = {
    name: string
    location: string
    contact_number: string
    gas_slips?: GasSlipCreateNestedManyWithoutGas_stationInput
  }

  export type GasStationUncheckedCreateInput = {
    id?: number
    name: string
    location: string
    contact_number: string
    gas_slips?: GasSlipUncheckedCreateNestedManyWithoutGas_stationInput
  }

  export type GasStationUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    gas_slips?: GasSlipUpdateManyWithoutGas_stationNestedInput
  }

  export type GasStationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    gas_slips?: GasSlipUncheckedUpdateManyWithoutGas_stationNestedInput
  }

  export type GasStationCreateManyInput = {
    id?: number
    name: string
    location: string
    contact_number: string
  }

  export type GasStationUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
  }

  export type GasStationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
  }

  export type FuelTypeCreateInput = {
    name: string
    gas_slips?: GasSlipCreateNestedManyWithoutFuel_typeInput
  }

  export type FuelTypeUncheckedCreateInput = {
    id?: number
    name: string
    gas_slips?: GasSlipUncheckedCreateNestedManyWithoutFuel_typeInput
  }

  export type FuelTypeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    gas_slips?: GasSlipUpdateManyWithoutFuel_typeNestedInput
  }

  export type FuelTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    gas_slips?: GasSlipUncheckedUpdateManyWithoutFuel_typeNestedInput
  }

  export type FuelTypeCreateManyInput = {
    id?: number
    name: string
  }

  export type FuelTypeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type FuelTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TripTicketListRelationFilter = {
    every?: TripTicketWhereInput
    some?: TripTicketWhereInput
    none?: TripTicketWhereInput
  }

  export type GasSlipListRelationFilter = {
    every?: GasSlipWhereInput
    some?: GasSlipWhereInput
    none?: GasSlipWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TripTicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GasSlipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_number?: SortOrder
    plate_number?: SortOrder
    rf_id?: SortOrder
    classification_id?: SortOrder
    assignee_id?: SortOrder
    name?: SortOrder
    date_acquired?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VehicleAvgOrderByAggregateInput = {
    classification_id?: SortOrder
    status?: SortOrder
  }

  export type VehicleMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_number?: SortOrder
    plate_number?: SortOrder
    rf_id?: SortOrder
    classification_id?: SortOrder
    assignee_id?: SortOrder
    name?: SortOrder
    date_acquired?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VehicleMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_number?: SortOrder
    plate_number?: SortOrder
    rf_id?: SortOrder
    classification_id?: SortOrder
    assignee_id?: SortOrder
    name?: SortOrder
    date_acquired?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VehicleSumOrderByAggregateInput = {
    classification_id?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type VehicleRelationFilter = {
    is?: VehicleWhereInput
    isNot?: VehicleWhereInput
  }

  export type TripTicketApproverListRelationFilter = {
    every?: TripTicketApproverWhereInput
    some?: TripTicketApproverWhereInput
    none?: TripTicketApproverWhereInput
  }

  export type TripTicketApproverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TripTicketCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    passengers?: SortOrder
    destination?: SortOrder
    purpose?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    actual_start_time?: SortOrder
    actual_end_time?: SortOrder
    is_operation?: SortOrder
    is_stay_in?: SortOrder
    is_personal?: SortOrder
    is_out_of_coverage?: SortOrder
    prepared_by_id?: SortOrder
    status?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TripTicketAvgOrderByAggregateInput = {
    status?: SortOrder
  }

  export type TripTicketMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    passengers?: SortOrder
    destination?: SortOrder
    purpose?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    actual_start_time?: SortOrder
    actual_end_time?: SortOrder
    is_operation?: SortOrder
    is_stay_in?: SortOrder
    is_personal?: SortOrder
    is_out_of_coverage?: SortOrder
    prepared_by_id?: SortOrder
    status?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TripTicketMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    passengers?: SortOrder
    destination?: SortOrder
    purpose?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    actual_start_time?: SortOrder
    actual_end_time?: SortOrder
    is_operation?: SortOrder
    is_stay_in?: SortOrder
    is_personal?: SortOrder
    is_out_of_coverage?: SortOrder
    prepared_by_id?: SortOrder
    status?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TripTicketSumOrderByAggregateInput = {
    status?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TripTicketRelationFilter = {
    is?: TripTicketWhereInput
    isNot?: TripTicketWhereInput
  }

  export type TripTicketApproverTrip_ticket_idOrderCompoundUniqueInput = {
    trip_ticket_id: string
    order: number
  }

  export type TripTicketApproverCountOrderByAggregateInput = {
    id?: SortOrder
    trip_ticket_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
    metadata?: SortOrder
  }

  export type TripTicketApproverAvgOrderByAggregateInput = {
    status?: SortOrder
    order?: SortOrder
  }

  export type TripTicketApproverMaxOrderByAggregateInput = {
    id?: SortOrder
    trip_ticket_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type TripTicketApproverMinOrderByAggregateInput = {
    id?: SortOrder
    trip_ticket_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type TripTicketApproverSumOrderByAggregateInput = {
    status?: SortOrder
    order?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type GasStationRelationFilter = {
    is?: GasStationWhereInput
    isNot?: GasStationWhereInput
  }

  export type FuelTypeRelationFilter = {
    is?: FuelTypeWhereInput
    isNot?: FuelTypeWhereInput
  }

  export type GasSlipApproverListRelationFilter = {
    every?: GasSlipApproverWhereInput
    some?: GasSlipApproverWhereInput
    none?: GasSlipApproverWhereInput
  }

  export type GasSlipApproverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GasSlipCountOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_number?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    requested_by_id?: SortOrder
    with_container?: SortOrder
    liter_in_text?: SortOrder
    actual_liter?: SortOrder
    price_per_liter?: SortOrder
    purpose?: SortOrder
    is_posted?: SortOrder
    print_count?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GasSlipAvgOrderByAggregateInput = {
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    actual_liter?: SortOrder
    price_per_liter?: SortOrder
    print_count?: SortOrder
  }

  export type GasSlipMaxOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_number?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    requested_by_id?: SortOrder
    with_container?: SortOrder
    liter_in_text?: SortOrder
    actual_liter?: SortOrder
    price_per_liter?: SortOrder
    purpose?: SortOrder
    is_posted?: SortOrder
    print_count?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GasSlipMinOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_number?: SortOrder
    vehicle_id?: SortOrder
    driver_id?: SortOrder
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    requested_by_id?: SortOrder
    with_container?: SortOrder
    liter_in_text?: SortOrder
    actual_liter?: SortOrder
    price_per_liter?: SortOrder
    purpose?: SortOrder
    is_posted?: SortOrder
    print_count?: SortOrder
    cancelled_by?: SortOrder
    created_by?: SortOrder
    updated_by?: SortOrder
    cancelled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GasSlipSumOrderByAggregateInput = {
    gas_station_id?: SortOrder
    fuel_type_id?: SortOrder
    actual_liter?: SortOrder
    price_per_liter?: SortOrder
    print_count?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type GasSlipRelationFilter = {
    is?: GasSlipWhereInput
    isNot?: GasSlipWhereInput
  }

  export type GasSlipApproverGas_slip_idOrderCompoundUniqueInput = {
    gas_slip_id: string
    order: number
  }

  export type GasSlipApproverCountOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
    metadata?: SortOrder
  }

  export type GasSlipApproverAvgOrderByAggregateInput = {
    status?: SortOrder
    order?: SortOrder
  }

  export type GasSlipApproverMaxOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type GasSlipApproverMinOrderByAggregateInput = {
    id?: SortOrder
    gas_slip_id?: SortOrder
    approver_id?: SortOrder
    date_approval?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    label?: SortOrder
    order?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type GasSlipApproverSumOrderByAggregateInput = {
    status?: SortOrder
    order?: SortOrder
  }

  export type GasStationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    contact_number?: SortOrder
  }

  export type GasStationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GasStationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    contact_number?: SortOrder
  }

  export type GasStationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    contact_number?: SortOrder
  }

  export type GasStationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FuelTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type FuelTypeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FuelTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type FuelTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type FuelTypeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TripTicketCreateNestedManyWithoutVehicleInput = {
    create?: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput> | TripTicketCreateWithoutVehicleInput[] | TripTicketUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: TripTicketCreateOrConnectWithoutVehicleInput | TripTicketCreateOrConnectWithoutVehicleInput[]
    createMany?: TripTicketCreateManyVehicleInputEnvelope
    connect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
  }

  export type GasSlipCreateNestedManyWithoutVehicleInput = {
    create?: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput> | GasSlipCreateWithoutVehicleInput[] | GasSlipUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutVehicleInput | GasSlipCreateOrConnectWithoutVehicleInput[]
    createMany?: GasSlipCreateManyVehicleInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type TripTicketUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput> | TripTicketCreateWithoutVehicleInput[] | TripTicketUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: TripTicketCreateOrConnectWithoutVehicleInput | TripTicketCreateOrConnectWithoutVehicleInput[]
    createMany?: TripTicketCreateManyVehicleInputEnvelope
    connect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
  }

  export type GasSlipUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput> | GasSlipCreateWithoutVehicleInput[] | GasSlipUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutVehicleInput | GasSlipCreateOrConnectWithoutVehicleInput[]
    createMany?: GasSlipCreateManyVehicleInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TripTicketUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput> | TripTicketCreateWithoutVehicleInput[] | TripTicketUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: TripTicketCreateOrConnectWithoutVehicleInput | TripTicketCreateOrConnectWithoutVehicleInput[]
    upsert?: TripTicketUpsertWithWhereUniqueWithoutVehicleInput | TripTicketUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: TripTicketCreateManyVehicleInputEnvelope
    set?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    disconnect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    delete?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    connect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    update?: TripTicketUpdateWithWhereUniqueWithoutVehicleInput | TripTicketUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: TripTicketUpdateManyWithWhereWithoutVehicleInput | TripTicketUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: TripTicketScalarWhereInput | TripTicketScalarWhereInput[]
  }

  export type GasSlipUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput> | GasSlipCreateWithoutVehicleInput[] | GasSlipUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutVehicleInput | GasSlipCreateOrConnectWithoutVehicleInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutVehicleInput | GasSlipUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: GasSlipCreateManyVehicleInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutVehicleInput | GasSlipUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutVehicleInput | GasSlipUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type TripTicketUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput> | TripTicketCreateWithoutVehicleInput[] | TripTicketUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: TripTicketCreateOrConnectWithoutVehicleInput | TripTicketCreateOrConnectWithoutVehicleInput[]
    upsert?: TripTicketUpsertWithWhereUniqueWithoutVehicleInput | TripTicketUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: TripTicketCreateManyVehicleInputEnvelope
    set?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    disconnect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    delete?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    connect?: TripTicketWhereUniqueInput | TripTicketWhereUniqueInput[]
    update?: TripTicketUpdateWithWhereUniqueWithoutVehicleInput | TripTicketUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: TripTicketUpdateManyWithWhereWithoutVehicleInput | TripTicketUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: TripTicketScalarWhereInput | TripTicketScalarWhereInput[]
  }

  export type GasSlipUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput> | GasSlipCreateWithoutVehicleInput[] | GasSlipUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutVehicleInput | GasSlipCreateOrConnectWithoutVehicleInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutVehicleInput | GasSlipUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: GasSlipCreateManyVehicleInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutVehicleInput | GasSlipUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutVehicleInput | GasSlipUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type VehicleCreateNestedOneWithoutTrip_ticketsInput = {
    create?: XOR<VehicleCreateWithoutTrip_ticketsInput, VehicleUncheckedCreateWithoutTrip_ticketsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutTrip_ticketsInput
    connect?: VehicleWhereUniqueInput
  }

  export type TripTicketApproverCreateNestedManyWithoutTrip_ticketInput = {
    create?: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput> | TripTicketApproverCreateWithoutTrip_ticketInput[] | TripTicketApproverUncheckedCreateWithoutTrip_ticketInput[]
    connectOrCreate?: TripTicketApproverCreateOrConnectWithoutTrip_ticketInput | TripTicketApproverCreateOrConnectWithoutTrip_ticketInput[]
    createMany?: TripTicketApproverCreateManyTrip_ticketInputEnvelope
    connect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
  }

  export type TripTicketApproverUncheckedCreateNestedManyWithoutTrip_ticketInput = {
    create?: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput> | TripTicketApproverCreateWithoutTrip_ticketInput[] | TripTicketApproverUncheckedCreateWithoutTrip_ticketInput[]
    connectOrCreate?: TripTicketApproverCreateOrConnectWithoutTrip_ticketInput | TripTicketApproverCreateOrConnectWithoutTrip_ticketInput[]
    createMany?: TripTicketApproverCreateManyTrip_ticketInputEnvelope
    connect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type VehicleUpdateOneRequiredWithoutTrip_ticketsNestedInput = {
    create?: XOR<VehicleCreateWithoutTrip_ticketsInput, VehicleUncheckedCreateWithoutTrip_ticketsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutTrip_ticketsInput
    upsert?: VehicleUpsertWithoutTrip_ticketsInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutTrip_ticketsInput, VehicleUpdateWithoutTrip_ticketsInput>, VehicleUncheckedUpdateWithoutTrip_ticketsInput>
  }

  export type TripTicketApproverUpdateManyWithoutTrip_ticketNestedInput = {
    create?: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput> | TripTicketApproverCreateWithoutTrip_ticketInput[] | TripTicketApproverUncheckedCreateWithoutTrip_ticketInput[]
    connectOrCreate?: TripTicketApproverCreateOrConnectWithoutTrip_ticketInput | TripTicketApproverCreateOrConnectWithoutTrip_ticketInput[]
    upsert?: TripTicketApproverUpsertWithWhereUniqueWithoutTrip_ticketInput | TripTicketApproverUpsertWithWhereUniqueWithoutTrip_ticketInput[]
    createMany?: TripTicketApproverCreateManyTrip_ticketInputEnvelope
    set?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    disconnect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    delete?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    connect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    update?: TripTicketApproverUpdateWithWhereUniqueWithoutTrip_ticketInput | TripTicketApproverUpdateWithWhereUniqueWithoutTrip_ticketInput[]
    updateMany?: TripTicketApproverUpdateManyWithWhereWithoutTrip_ticketInput | TripTicketApproverUpdateManyWithWhereWithoutTrip_ticketInput[]
    deleteMany?: TripTicketApproverScalarWhereInput | TripTicketApproverScalarWhereInput[]
  }

  export type TripTicketApproverUncheckedUpdateManyWithoutTrip_ticketNestedInput = {
    create?: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput> | TripTicketApproverCreateWithoutTrip_ticketInput[] | TripTicketApproverUncheckedCreateWithoutTrip_ticketInput[]
    connectOrCreate?: TripTicketApproverCreateOrConnectWithoutTrip_ticketInput | TripTicketApproverCreateOrConnectWithoutTrip_ticketInput[]
    upsert?: TripTicketApproverUpsertWithWhereUniqueWithoutTrip_ticketInput | TripTicketApproverUpsertWithWhereUniqueWithoutTrip_ticketInput[]
    createMany?: TripTicketApproverCreateManyTrip_ticketInputEnvelope
    set?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    disconnect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    delete?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    connect?: TripTicketApproverWhereUniqueInput | TripTicketApproverWhereUniqueInput[]
    update?: TripTicketApproverUpdateWithWhereUniqueWithoutTrip_ticketInput | TripTicketApproverUpdateWithWhereUniqueWithoutTrip_ticketInput[]
    updateMany?: TripTicketApproverUpdateManyWithWhereWithoutTrip_ticketInput | TripTicketApproverUpdateManyWithWhereWithoutTrip_ticketInput[]
    deleteMany?: TripTicketApproverScalarWhereInput | TripTicketApproverScalarWhereInput[]
  }

  export type TripTicketCreateNestedOneWithoutTrip_ticket_approversInput = {
    create?: XOR<TripTicketCreateWithoutTrip_ticket_approversInput, TripTicketUncheckedCreateWithoutTrip_ticket_approversInput>
    connectOrCreate?: TripTicketCreateOrConnectWithoutTrip_ticket_approversInput
    connect?: TripTicketWhereUniqueInput
  }

  export type TripTicketUpdateOneRequiredWithoutTrip_ticket_approversNestedInput = {
    create?: XOR<TripTicketCreateWithoutTrip_ticket_approversInput, TripTicketUncheckedCreateWithoutTrip_ticket_approversInput>
    connectOrCreate?: TripTicketCreateOrConnectWithoutTrip_ticket_approversInput
    upsert?: TripTicketUpsertWithoutTrip_ticket_approversInput
    connect?: TripTicketWhereUniqueInput
    update?: XOR<XOR<TripTicketUpdateToOneWithWhereWithoutTrip_ticket_approversInput, TripTicketUpdateWithoutTrip_ticket_approversInput>, TripTicketUncheckedUpdateWithoutTrip_ticket_approversInput>
  }

  export type VehicleCreateNestedOneWithoutGas_slipsInput = {
    create?: XOR<VehicleCreateWithoutGas_slipsInput, VehicleUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutGas_slipsInput
    connect?: VehicleWhereUniqueInput
  }

  export type GasStationCreateNestedOneWithoutGas_slipsInput = {
    create?: XOR<GasStationCreateWithoutGas_slipsInput, GasStationUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: GasStationCreateOrConnectWithoutGas_slipsInput
    connect?: GasStationWhereUniqueInput
  }

  export type FuelTypeCreateNestedOneWithoutGas_slipsInput = {
    create?: XOR<FuelTypeCreateWithoutGas_slipsInput, FuelTypeUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: FuelTypeCreateOrConnectWithoutGas_slipsInput
    connect?: FuelTypeWhereUniqueInput
  }

  export type GasSlipApproverCreateNestedManyWithoutGas_slipInput = {
    create?: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput> | GasSlipApproverCreateWithoutGas_slipInput[] | GasSlipApproverUncheckedCreateWithoutGas_slipInput[]
    connectOrCreate?: GasSlipApproverCreateOrConnectWithoutGas_slipInput | GasSlipApproverCreateOrConnectWithoutGas_slipInput[]
    createMany?: GasSlipApproverCreateManyGas_slipInputEnvelope
    connect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
  }

  export type GasSlipApproverUncheckedCreateNestedManyWithoutGas_slipInput = {
    create?: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput> | GasSlipApproverCreateWithoutGas_slipInput[] | GasSlipApproverUncheckedCreateWithoutGas_slipInput[]
    connectOrCreate?: GasSlipApproverCreateOrConnectWithoutGas_slipInput | GasSlipApproverCreateOrConnectWithoutGas_slipInput[]
    createMany?: GasSlipApproverCreateManyGas_slipInputEnvelope
    connect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VehicleUpdateOneRequiredWithoutGas_slipsNestedInput = {
    create?: XOR<VehicleCreateWithoutGas_slipsInput, VehicleUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutGas_slipsInput
    upsert?: VehicleUpsertWithoutGas_slipsInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutGas_slipsInput, VehicleUpdateWithoutGas_slipsInput>, VehicleUncheckedUpdateWithoutGas_slipsInput>
  }

  export type GasStationUpdateOneRequiredWithoutGas_slipsNestedInput = {
    create?: XOR<GasStationCreateWithoutGas_slipsInput, GasStationUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: GasStationCreateOrConnectWithoutGas_slipsInput
    upsert?: GasStationUpsertWithoutGas_slipsInput
    connect?: GasStationWhereUniqueInput
    update?: XOR<XOR<GasStationUpdateToOneWithWhereWithoutGas_slipsInput, GasStationUpdateWithoutGas_slipsInput>, GasStationUncheckedUpdateWithoutGas_slipsInput>
  }

  export type FuelTypeUpdateOneRequiredWithoutGas_slipsNestedInput = {
    create?: XOR<FuelTypeCreateWithoutGas_slipsInput, FuelTypeUncheckedCreateWithoutGas_slipsInput>
    connectOrCreate?: FuelTypeCreateOrConnectWithoutGas_slipsInput
    upsert?: FuelTypeUpsertWithoutGas_slipsInput
    connect?: FuelTypeWhereUniqueInput
    update?: XOR<XOR<FuelTypeUpdateToOneWithWhereWithoutGas_slipsInput, FuelTypeUpdateWithoutGas_slipsInput>, FuelTypeUncheckedUpdateWithoutGas_slipsInput>
  }

  export type GasSlipApproverUpdateManyWithoutGas_slipNestedInput = {
    create?: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput> | GasSlipApproverCreateWithoutGas_slipInput[] | GasSlipApproverUncheckedCreateWithoutGas_slipInput[]
    connectOrCreate?: GasSlipApproverCreateOrConnectWithoutGas_slipInput | GasSlipApproverCreateOrConnectWithoutGas_slipInput[]
    upsert?: GasSlipApproverUpsertWithWhereUniqueWithoutGas_slipInput | GasSlipApproverUpsertWithWhereUniqueWithoutGas_slipInput[]
    createMany?: GasSlipApproverCreateManyGas_slipInputEnvelope
    set?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    disconnect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    delete?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    connect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    update?: GasSlipApproverUpdateWithWhereUniqueWithoutGas_slipInput | GasSlipApproverUpdateWithWhereUniqueWithoutGas_slipInput[]
    updateMany?: GasSlipApproverUpdateManyWithWhereWithoutGas_slipInput | GasSlipApproverUpdateManyWithWhereWithoutGas_slipInput[]
    deleteMany?: GasSlipApproverScalarWhereInput | GasSlipApproverScalarWhereInput[]
  }

  export type GasSlipApproverUncheckedUpdateManyWithoutGas_slipNestedInput = {
    create?: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput> | GasSlipApproverCreateWithoutGas_slipInput[] | GasSlipApproverUncheckedCreateWithoutGas_slipInput[]
    connectOrCreate?: GasSlipApproverCreateOrConnectWithoutGas_slipInput | GasSlipApproverCreateOrConnectWithoutGas_slipInput[]
    upsert?: GasSlipApproverUpsertWithWhereUniqueWithoutGas_slipInput | GasSlipApproverUpsertWithWhereUniqueWithoutGas_slipInput[]
    createMany?: GasSlipApproverCreateManyGas_slipInputEnvelope
    set?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    disconnect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    delete?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    connect?: GasSlipApproverWhereUniqueInput | GasSlipApproverWhereUniqueInput[]
    update?: GasSlipApproverUpdateWithWhereUniqueWithoutGas_slipInput | GasSlipApproverUpdateWithWhereUniqueWithoutGas_slipInput[]
    updateMany?: GasSlipApproverUpdateManyWithWhereWithoutGas_slipInput | GasSlipApproverUpdateManyWithWhereWithoutGas_slipInput[]
    deleteMany?: GasSlipApproverScalarWhereInput | GasSlipApproverScalarWhereInput[]
  }

  export type GasSlipCreateNestedOneWithoutGas_slip_approversInput = {
    create?: XOR<GasSlipCreateWithoutGas_slip_approversInput, GasSlipUncheckedCreateWithoutGas_slip_approversInput>
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_slip_approversInput
    connect?: GasSlipWhereUniqueInput
  }

  export type GasSlipUpdateOneRequiredWithoutGas_slip_approversNestedInput = {
    create?: XOR<GasSlipCreateWithoutGas_slip_approversInput, GasSlipUncheckedCreateWithoutGas_slip_approversInput>
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_slip_approversInput
    upsert?: GasSlipUpsertWithoutGas_slip_approversInput
    connect?: GasSlipWhereUniqueInput
    update?: XOR<XOR<GasSlipUpdateToOneWithWhereWithoutGas_slip_approversInput, GasSlipUpdateWithoutGas_slip_approversInput>, GasSlipUncheckedUpdateWithoutGas_slip_approversInput>
  }

  export type GasSlipCreateNestedManyWithoutGas_stationInput = {
    create?: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput> | GasSlipCreateWithoutGas_stationInput[] | GasSlipUncheckedCreateWithoutGas_stationInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_stationInput | GasSlipCreateOrConnectWithoutGas_stationInput[]
    createMany?: GasSlipCreateManyGas_stationInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type GasSlipUncheckedCreateNestedManyWithoutGas_stationInput = {
    create?: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput> | GasSlipCreateWithoutGas_stationInput[] | GasSlipUncheckedCreateWithoutGas_stationInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_stationInput | GasSlipCreateOrConnectWithoutGas_stationInput[]
    createMany?: GasSlipCreateManyGas_stationInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type GasSlipUpdateManyWithoutGas_stationNestedInput = {
    create?: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput> | GasSlipCreateWithoutGas_stationInput[] | GasSlipUncheckedCreateWithoutGas_stationInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_stationInput | GasSlipCreateOrConnectWithoutGas_stationInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutGas_stationInput | GasSlipUpsertWithWhereUniqueWithoutGas_stationInput[]
    createMany?: GasSlipCreateManyGas_stationInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutGas_stationInput | GasSlipUpdateWithWhereUniqueWithoutGas_stationInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutGas_stationInput | GasSlipUpdateManyWithWhereWithoutGas_stationInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type GasSlipUncheckedUpdateManyWithoutGas_stationNestedInput = {
    create?: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput> | GasSlipCreateWithoutGas_stationInput[] | GasSlipUncheckedCreateWithoutGas_stationInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutGas_stationInput | GasSlipCreateOrConnectWithoutGas_stationInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutGas_stationInput | GasSlipUpsertWithWhereUniqueWithoutGas_stationInput[]
    createMany?: GasSlipCreateManyGas_stationInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutGas_stationInput | GasSlipUpdateWithWhereUniqueWithoutGas_stationInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutGas_stationInput | GasSlipUpdateManyWithWhereWithoutGas_stationInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type GasSlipCreateNestedManyWithoutFuel_typeInput = {
    create?: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput> | GasSlipCreateWithoutFuel_typeInput[] | GasSlipUncheckedCreateWithoutFuel_typeInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutFuel_typeInput | GasSlipCreateOrConnectWithoutFuel_typeInput[]
    createMany?: GasSlipCreateManyFuel_typeInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type GasSlipUncheckedCreateNestedManyWithoutFuel_typeInput = {
    create?: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput> | GasSlipCreateWithoutFuel_typeInput[] | GasSlipUncheckedCreateWithoutFuel_typeInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutFuel_typeInput | GasSlipCreateOrConnectWithoutFuel_typeInput[]
    createMany?: GasSlipCreateManyFuel_typeInputEnvelope
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
  }

  export type GasSlipUpdateManyWithoutFuel_typeNestedInput = {
    create?: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput> | GasSlipCreateWithoutFuel_typeInput[] | GasSlipUncheckedCreateWithoutFuel_typeInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutFuel_typeInput | GasSlipCreateOrConnectWithoutFuel_typeInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutFuel_typeInput | GasSlipUpsertWithWhereUniqueWithoutFuel_typeInput[]
    createMany?: GasSlipCreateManyFuel_typeInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutFuel_typeInput | GasSlipUpdateWithWhereUniqueWithoutFuel_typeInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutFuel_typeInput | GasSlipUpdateManyWithWhereWithoutFuel_typeInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type GasSlipUncheckedUpdateManyWithoutFuel_typeNestedInput = {
    create?: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput> | GasSlipCreateWithoutFuel_typeInput[] | GasSlipUncheckedCreateWithoutFuel_typeInput[]
    connectOrCreate?: GasSlipCreateOrConnectWithoutFuel_typeInput | GasSlipCreateOrConnectWithoutFuel_typeInput[]
    upsert?: GasSlipUpsertWithWhereUniqueWithoutFuel_typeInput | GasSlipUpsertWithWhereUniqueWithoutFuel_typeInput[]
    createMany?: GasSlipCreateManyFuel_typeInputEnvelope
    set?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    disconnect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    delete?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    connect?: GasSlipWhereUniqueInput | GasSlipWhereUniqueInput[]
    update?: GasSlipUpdateWithWhereUniqueWithoutFuel_typeInput | GasSlipUpdateWithWhereUniqueWithoutFuel_typeInput[]
    updateMany?: GasSlipUpdateManyWithWhereWithoutFuel_typeInput | GasSlipUpdateManyWithWhereWithoutFuel_typeInput[]
    deleteMany?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type TripTicketCreateWithoutVehicleInput = {
    id?: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_ticket_approvers?: TripTicketApproverCreateNestedManyWithoutTrip_ticketInput
  }

  export type TripTicketUncheckedCreateWithoutVehicleInput = {
    id?: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_ticket_approvers?: TripTicketApproverUncheckedCreateNestedManyWithoutTrip_ticketInput
  }

  export type TripTicketCreateOrConnectWithoutVehicleInput = {
    where: TripTicketWhereUniqueInput
    create: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput>
  }

  export type TripTicketCreateManyVehicleInputEnvelope = {
    data: TripTicketCreateManyVehicleInput | TripTicketCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type GasSlipCreateWithoutVehicleInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_station: GasStationCreateNestedOneWithoutGas_slipsInput
    fuel_type: FuelTypeCreateNestedOneWithoutGas_slipsInput
    gas_slip_approvers?: GasSlipApproverCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipUncheckedCreateWithoutVehicleInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipCreateOrConnectWithoutVehicleInput = {
    where: GasSlipWhereUniqueInput
    create: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput>
  }

  export type GasSlipCreateManyVehicleInputEnvelope = {
    data: GasSlipCreateManyVehicleInput | GasSlipCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type TripTicketUpsertWithWhereUniqueWithoutVehicleInput = {
    where: TripTicketWhereUniqueInput
    update: XOR<TripTicketUpdateWithoutVehicleInput, TripTicketUncheckedUpdateWithoutVehicleInput>
    create: XOR<TripTicketCreateWithoutVehicleInput, TripTicketUncheckedCreateWithoutVehicleInput>
  }

  export type TripTicketUpdateWithWhereUniqueWithoutVehicleInput = {
    where: TripTicketWhereUniqueInput
    data: XOR<TripTicketUpdateWithoutVehicleInput, TripTicketUncheckedUpdateWithoutVehicleInput>
  }

  export type TripTicketUpdateManyWithWhereWithoutVehicleInput = {
    where: TripTicketScalarWhereInput
    data: XOR<TripTicketUpdateManyMutationInput, TripTicketUncheckedUpdateManyWithoutVehicleInput>
  }

  export type TripTicketScalarWhereInput = {
    AND?: TripTicketScalarWhereInput | TripTicketScalarWhereInput[]
    OR?: TripTicketScalarWhereInput[]
    NOT?: TripTicketScalarWhereInput | TripTicketScalarWhereInput[]
    id?: StringFilter<"TripTicket"> | string
    vehicle_id?: StringFilter<"TripTicket"> | string
    driver_id?: StringFilter<"TripTicket"> | string
    passengers?: StringFilter<"TripTicket"> | string
    destination?: StringFilter<"TripTicket"> | string
    purpose?: StringFilter<"TripTicket"> | string
    start_time?: DateTimeFilter<"TripTicket"> | Date | string
    end_time?: DateTimeFilter<"TripTicket"> | Date | string
    actual_start_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    actual_end_time?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    is_operation?: BoolFilter<"TripTicket"> | boolean
    is_stay_in?: BoolFilter<"TripTicket"> | boolean
    is_personal?: BoolFilter<"TripTicket"> | boolean
    is_out_of_coverage?: BoolFilter<"TripTicket"> | boolean
    prepared_by_id?: StringFilter<"TripTicket"> | string
    status?: IntFilter<"TripTicket"> | number
    cancelled_by?: StringNullableFilter<"TripTicket"> | string | null
    created_by?: StringFilter<"TripTicket"> | string
    updated_by?: StringNullableFilter<"TripTicket"> | string | null
    cancelled_at?: DateTimeNullableFilter<"TripTicket"> | Date | string | null
    created_at?: DateTimeFilter<"TripTicket"> | Date | string
    updated_at?: DateTimeFilter<"TripTicket"> | Date | string
  }

  export type GasSlipUpsertWithWhereUniqueWithoutVehicleInput = {
    where: GasSlipWhereUniqueInput
    update: XOR<GasSlipUpdateWithoutVehicleInput, GasSlipUncheckedUpdateWithoutVehicleInput>
    create: XOR<GasSlipCreateWithoutVehicleInput, GasSlipUncheckedCreateWithoutVehicleInput>
  }

  export type GasSlipUpdateWithWhereUniqueWithoutVehicleInput = {
    where: GasSlipWhereUniqueInput
    data: XOR<GasSlipUpdateWithoutVehicleInput, GasSlipUncheckedUpdateWithoutVehicleInput>
  }

  export type GasSlipUpdateManyWithWhereWithoutVehicleInput = {
    where: GasSlipScalarWhereInput
    data: XOR<GasSlipUpdateManyMutationInput, GasSlipUncheckedUpdateManyWithoutVehicleInput>
  }

  export type GasSlipScalarWhereInput = {
    AND?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
    OR?: GasSlipScalarWhereInput[]
    NOT?: GasSlipScalarWhereInput | GasSlipScalarWhereInput[]
    id?: StringFilter<"GasSlip"> | string
    gas_slip_number?: StringFilter<"GasSlip"> | string
    vehicle_id?: StringFilter<"GasSlip"> | string
    driver_id?: StringFilter<"GasSlip"> | string
    gas_station_id?: IntFilter<"GasSlip"> | number
    fuel_type_id?: IntFilter<"GasSlip"> | number
    requested_by_id?: StringFilter<"GasSlip"> | string
    with_container?: BoolFilter<"GasSlip"> | boolean
    liter_in_text?: StringFilter<"GasSlip"> | string
    actual_liter?: FloatNullableFilter<"GasSlip"> | number | null
    price_per_liter?: FloatNullableFilter<"GasSlip"> | number | null
    purpose?: StringFilter<"GasSlip"> | string
    is_posted?: BoolFilter<"GasSlip"> | boolean
    print_count?: IntFilter<"GasSlip"> | number
    cancelled_by?: StringNullableFilter<"GasSlip"> | string | null
    created_by?: StringFilter<"GasSlip"> | string
    updated_by?: StringNullableFilter<"GasSlip"> | string | null
    cancelled_at?: DateTimeNullableFilter<"GasSlip"> | Date | string | null
    created_at?: DateTimeFilter<"GasSlip"> | Date | string
    updated_at?: DateTimeFilter<"GasSlip"> | Date | string
  }

  export type VehicleCreateWithoutTrip_ticketsInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slips?: GasSlipCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutTrip_ticketsInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slips?: GasSlipUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutTrip_ticketsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutTrip_ticketsInput, VehicleUncheckedCreateWithoutTrip_ticketsInput>
  }

  export type TripTicketApproverCreateWithoutTrip_ticketInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUncheckedCreateWithoutTrip_ticketInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverCreateOrConnectWithoutTrip_ticketInput = {
    where: TripTicketApproverWhereUniqueInput
    create: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput>
  }

  export type TripTicketApproverCreateManyTrip_ticketInputEnvelope = {
    data: TripTicketApproverCreateManyTrip_ticketInput | TripTicketApproverCreateManyTrip_ticketInput[]
    skipDuplicates?: boolean
  }

  export type VehicleUpsertWithoutTrip_ticketsInput = {
    update: XOR<VehicleUpdateWithoutTrip_ticketsInput, VehicleUncheckedUpdateWithoutTrip_ticketsInput>
    create: XOR<VehicleCreateWithoutTrip_ticketsInput, VehicleUncheckedCreateWithoutTrip_ticketsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutTrip_ticketsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutTrip_ticketsInput, VehicleUncheckedUpdateWithoutTrip_ticketsInput>
  }

  export type VehicleUpdateWithoutTrip_ticketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slips?: GasSlipUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutTrip_ticketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slips?: GasSlipUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type TripTicketApproverUpsertWithWhereUniqueWithoutTrip_ticketInput = {
    where: TripTicketApproverWhereUniqueInput
    update: XOR<TripTicketApproverUpdateWithoutTrip_ticketInput, TripTicketApproverUncheckedUpdateWithoutTrip_ticketInput>
    create: XOR<TripTicketApproverCreateWithoutTrip_ticketInput, TripTicketApproverUncheckedCreateWithoutTrip_ticketInput>
  }

  export type TripTicketApproverUpdateWithWhereUniqueWithoutTrip_ticketInput = {
    where: TripTicketApproverWhereUniqueInput
    data: XOR<TripTicketApproverUpdateWithoutTrip_ticketInput, TripTicketApproverUncheckedUpdateWithoutTrip_ticketInput>
  }

  export type TripTicketApproverUpdateManyWithWhereWithoutTrip_ticketInput = {
    where: TripTicketApproverScalarWhereInput
    data: XOR<TripTicketApproverUpdateManyMutationInput, TripTicketApproverUncheckedUpdateManyWithoutTrip_ticketInput>
  }

  export type TripTicketApproverScalarWhereInput = {
    AND?: TripTicketApproverScalarWhereInput | TripTicketApproverScalarWhereInput[]
    OR?: TripTicketApproverScalarWhereInput[]
    NOT?: TripTicketApproverScalarWhereInput | TripTicketApproverScalarWhereInput[]
    id?: StringFilter<"TripTicketApprover"> | string
    trip_ticket_id?: StringFilter<"TripTicketApprover"> | string
    approver_id?: StringFilter<"TripTicketApprover"> | string
    date_approval?: DateTimeNullableFilter<"TripTicketApprover"> | Date | string | null
    notes?: StringFilter<"TripTicketApprover"> | string
    status?: IntFilter<"TripTicketApprover"> | number
    label?: StringFilter<"TripTicketApprover"> | string
    order?: IntFilter<"TripTicketApprover"> | number
    updated_by?: StringNullableFilter<"TripTicketApprover"> | string | null
    updated_at?: DateTimeFilter<"TripTicketApprover"> | Date | string
    metadata?: JsonNullableFilter<"TripTicketApprover">
  }

  export type TripTicketCreateWithoutTrip_ticket_approversInput = {
    id?: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutTrip_ticketsInput
  }

  export type TripTicketUncheckedCreateWithoutTrip_ticket_approversInput = {
    id?: string
    vehicle_id: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TripTicketCreateOrConnectWithoutTrip_ticket_approversInput = {
    where: TripTicketWhereUniqueInput
    create: XOR<TripTicketCreateWithoutTrip_ticket_approversInput, TripTicketUncheckedCreateWithoutTrip_ticket_approversInput>
  }

  export type TripTicketUpsertWithoutTrip_ticket_approversInput = {
    update: XOR<TripTicketUpdateWithoutTrip_ticket_approversInput, TripTicketUncheckedUpdateWithoutTrip_ticket_approversInput>
    create: XOR<TripTicketCreateWithoutTrip_ticket_approversInput, TripTicketUncheckedCreateWithoutTrip_ticket_approversInput>
    where?: TripTicketWhereInput
  }

  export type TripTicketUpdateToOneWithWhereWithoutTrip_ticket_approversInput = {
    where?: TripTicketWhereInput
    data: XOR<TripTicketUpdateWithoutTrip_ticket_approversInput, TripTicketUncheckedUpdateWithoutTrip_ticket_approversInput>
  }

  export type TripTicketUpdateWithoutTrip_ticket_approversInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutTrip_ticketsNestedInput
  }

  export type TripTicketUncheckedUpdateWithoutTrip_ticket_approversInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleCreateWithoutGas_slipsInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_tickets?: TripTicketCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutGas_slipsInput = {
    id?: string
    vehicle_number: string
    plate_number: string
    rf_id: string
    classification_id: number
    assignee_id: string
    name: string
    date_acquired: Date | string
    status: number
    created_by: string
    updated_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    trip_tickets?: TripTicketUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutGas_slipsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutGas_slipsInput, VehicleUncheckedCreateWithoutGas_slipsInput>
  }

  export type GasStationCreateWithoutGas_slipsInput = {
    name: string
    location: string
    contact_number: string
  }

  export type GasStationUncheckedCreateWithoutGas_slipsInput = {
    id?: number
    name: string
    location: string
    contact_number: string
  }

  export type GasStationCreateOrConnectWithoutGas_slipsInput = {
    where: GasStationWhereUniqueInput
    create: XOR<GasStationCreateWithoutGas_slipsInput, GasStationUncheckedCreateWithoutGas_slipsInput>
  }

  export type FuelTypeCreateWithoutGas_slipsInput = {
    name: string
  }

  export type FuelTypeUncheckedCreateWithoutGas_slipsInput = {
    id?: number
    name: string
  }

  export type FuelTypeCreateOrConnectWithoutGas_slipsInput = {
    where: FuelTypeWhereUniqueInput
    create: XOR<FuelTypeCreateWithoutGas_slipsInput, FuelTypeUncheckedCreateWithoutGas_slipsInput>
  }

  export type GasSlipApproverCreateWithoutGas_slipInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUncheckedCreateWithoutGas_slipInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverCreateOrConnectWithoutGas_slipInput = {
    where: GasSlipApproverWhereUniqueInput
    create: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput>
  }

  export type GasSlipApproverCreateManyGas_slipInputEnvelope = {
    data: GasSlipApproverCreateManyGas_slipInput | GasSlipApproverCreateManyGas_slipInput[]
    skipDuplicates?: boolean
  }

  export type VehicleUpsertWithoutGas_slipsInput = {
    update: XOR<VehicleUpdateWithoutGas_slipsInput, VehicleUncheckedUpdateWithoutGas_slipsInput>
    create: XOR<VehicleCreateWithoutGas_slipsInput, VehicleUncheckedCreateWithoutGas_slipsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutGas_slipsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutGas_slipsInput, VehicleUncheckedUpdateWithoutGas_slipsInput>
  }

  export type VehicleUpdateWithoutGas_slipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_tickets?: TripTicketUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutGas_slipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    rf_id?: StringFieldUpdateOperationsInput | string
    classification_id?: IntFieldUpdateOperationsInput | number
    assignee_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date_acquired?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: IntFieldUpdateOperationsInput | number
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_tickets?: TripTicketUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type GasStationUpsertWithoutGas_slipsInput = {
    update: XOR<GasStationUpdateWithoutGas_slipsInput, GasStationUncheckedUpdateWithoutGas_slipsInput>
    create: XOR<GasStationCreateWithoutGas_slipsInput, GasStationUncheckedCreateWithoutGas_slipsInput>
    where?: GasStationWhereInput
  }

  export type GasStationUpdateToOneWithWhereWithoutGas_slipsInput = {
    where?: GasStationWhereInput
    data: XOR<GasStationUpdateWithoutGas_slipsInput, GasStationUncheckedUpdateWithoutGas_slipsInput>
  }

  export type GasStationUpdateWithoutGas_slipsInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
  }

  export type GasStationUncheckedUpdateWithoutGas_slipsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
  }

  export type FuelTypeUpsertWithoutGas_slipsInput = {
    update: XOR<FuelTypeUpdateWithoutGas_slipsInput, FuelTypeUncheckedUpdateWithoutGas_slipsInput>
    create: XOR<FuelTypeCreateWithoutGas_slipsInput, FuelTypeUncheckedCreateWithoutGas_slipsInput>
    where?: FuelTypeWhereInput
  }

  export type FuelTypeUpdateToOneWithWhereWithoutGas_slipsInput = {
    where?: FuelTypeWhereInput
    data: XOR<FuelTypeUpdateWithoutGas_slipsInput, FuelTypeUncheckedUpdateWithoutGas_slipsInput>
  }

  export type FuelTypeUpdateWithoutGas_slipsInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type FuelTypeUncheckedUpdateWithoutGas_slipsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type GasSlipApproverUpsertWithWhereUniqueWithoutGas_slipInput = {
    where: GasSlipApproverWhereUniqueInput
    update: XOR<GasSlipApproverUpdateWithoutGas_slipInput, GasSlipApproverUncheckedUpdateWithoutGas_slipInput>
    create: XOR<GasSlipApproverCreateWithoutGas_slipInput, GasSlipApproverUncheckedCreateWithoutGas_slipInput>
  }

  export type GasSlipApproverUpdateWithWhereUniqueWithoutGas_slipInput = {
    where: GasSlipApproverWhereUniqueInput
    data: XOR<GasSlipApproverUpdateWithoutGas_slipInput, GasSlipApproverUncheckedUpdateWithoutGas_slipInput>
  }

  export type GasSlipApproverUpdateManyWithWhereWithoutGas_slipInput = {
    where: GasSlipApproverScalarWhereInput
    data: XOR<GasSlipApproverUpdateManyMutationInput, GasSlipApproverUncheckedUpdateManyWithoutGas_slipInput>
  }

  export type GasSlipApproverScalarWhereInput = {
    AND?: GasSlipApproverScalarWhereInput | GasSlipApproverScalarWhereInput[]
    OR?: GasSlipApproverScalarWhereInput[]
    NOT?: GasSlipApproverScalarWhereInput | GasSlipApproverScalarWhereInput[]
    id?: StringFilter<"GasSlipApprover"> | string
    gas_slip_id?: StringFilter<"GasSlipApprover"> | string
    approver_id?: StringFilter<"GasSlipApprover"> | string
    date_approval?: DateTimeNullableFilter<"GasSlipApprover"> | Date | string | null
    notes?: StringFilter<"GasSlipApprover"> | string
    status?: IntFilter<"GasSlipApprover"> | number
    label?: StringFilter<"GasSlipApprover"> | string
    order?: IntFilter<"GasSlipApprover"> | number
    updated_by?: StringNullableFilter<"GasSlipApprover"> | string | null
    updated_at?: DateTimeFilter<"GasSlipApprover"> | Date | string
    metadata?: JsonNullableFilter<"GasSlipApprover">
  }

  export type GasSlipCreateWithoutGas_slip_approversInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutGas_slipsInput
    gas_station: GasStationCreateNestedOneWithoutGas_slipsInput
    fuel_type: FuelTypeCreateNestedOneWithoutGas_slipsInput
  }

  export type GasSlipUncheckedCreateWithoutGas_slip_approversInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GasSlipCreateOrConnectWithoutGas_slip_approversInput = {
    where: GasSlipWhereUniqueInput
    create: XOR<GasSlipCreateWithoutGas_slip_approversInput, GasSlipUncheckedCreateWithoutGas_slip_approversInput>
  }

  export type GasSlipUpsertWithoutGas_slip_approversInput = {
    update: XOR<GasSlipUpdateWithoutGas_slip_approversInput, GasSlipUncheckedUpdateWithoutGas_slip_approversInput>
    create: XOR<GasSlipCreateWithoutGas_slip_approversInput, GasSlipUncheckedCreateWithoutGas_slip_approversInput>
    where?: GasSlipWhereInput
  }

  export type GasSlipUpdateToOneWithWhereWithoutGas_slip_approversInput = {
    where?: GasSlipWhereInput
    data: XOR<GasSlipUpdateWithoutGas_slip_approversInput, GasSlipUncheckedUpdateWithoutGas_slip_approversInput>
  }

  export type GasSlipUpdateWithoutGas_slip_approversInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_station?: GasStationUpdateOneRequiredWithoutGas_slipsNestedInput
    fuel_type?: FuelTypeUpdateOneRequiredWithoutGas_slipsNestedInput
  }

  export type GasSlipUncheckedUpdateWithoutGas_slip_approversInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GasSlipCreateWithoutGas_stationInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutGas_slipsInput
    fuel_type: FuelTypeCreateNestedOneWithoutGas_slipsInput
    gas_slip_approvers?: GasSlipApproverCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipUncheckedCreateWithoutGas_stationInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipCreateOrConnectWithoutGas_stationInput = {
    where: GasSlipWhereUniqueInput
    create: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput>
  }

  export type GasSlipCreateManyGas_stationInputEnvelope = {
    data: GasSlipCreateManyGas_stationInput | GasSlipCreateManyGas_stationInput[]
    skipDuplicates?: boolean
  }

  export type GasSlipUpsertWithWhereUniqueWithoutGas_stationInput = {
    where: GasSlipWhereUniqueInput
    update: XOR<GasSlipUpdateWithoutGas_stationInput, GasSlipUncheckedUpdateWithoutGas_stationInput>
    create: XOR<GasSlipCreateWithoutGas_stationInput, GasSlipUncheckedCreateWithoutGas_stationInput>
  }

  export type GasSlipUpdateWithWhereUniqueWithoutGas_stationInput = {
    where: GasSlipWhereUniqueInput
    data: XOR<GasSlipUpdateWithoutGas_stationInput, GasSlipUncheckedUpdateWithoutGas_stationInput>
  }

  export type GasSlipUpdateManyWithWhereWithoutGas_stationInput = {
    where: GasSlipScalarWhereInput
    data: XOR<GasSlipUpdateManyMutationInput, GasSlipUncheckedUpdateManyWithoutGas_stationInput>
  }

  export type GasSlipCreateWithoutFuel_typeInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    vehicle: VehicleCreateNestedOneWithoutGas_slipsInput
    gas_station: GasStationCreateNestedOneWithoutGas_slipsInput
    gas_slip_approvers?: GasSlipApproverCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipUncheckedCreateWithoutFuel_typeInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedCreateNestedManyWithoutGas_slipInput
  }

  export type GasSlipCreateOrConnectWithoutFuel_typeInput = {
    where: GasSlipWhereUniqueInput
    create: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput>
  }

  export type GasSlipCreateManyFuel_typeInputEnvelope = {
    data: GasSlipCreateManyFuel_typeInput | GasSlipCreateManyFuel_typeInput[]
    skipDuplicates?: boolean
  }

  export type GasSlipUpsertWithWhereUniqueWithoutFuel_typeInput = {
    where: GasSlipWhereUniqueInput
    update: XOR<GasSlipUpdateWithoutFuel_typeInput, GasSlipUncheckedUpdateWithoutFuel_typeInput>
    create: XOR<GasSlipCreateWithoutFuel_typeInput, GasSlipUncheckedCreateWithoutFuel_typeInput>
  }

  export type GasSlipUpdateWithWhereUniqueWithoutFuel_typeInput = {
    where: GasSlipWhereUniqueInput
    data: XOR<GasSlipUpdateWithoutFuel_typeInput, GasSlipUncheckedUpdateWithoutFuel_typeInput>
  }

  export type GasSlipUpdateManyWithWhereWithoutFuel_typeInput = {
    where: GasSlipScalarWhereInput
    data: XOR<GasSlipUpdateManyMutationInput, GasSlipUncheckedUpdateManyWithoutFuel_typeInput>
  }

  export type TripTicketCreateManyVehicleInput = {
    id?: string
    driver_id: string
    passengers: string
    destination: string
    purpose: string
    start_time: Date | string
    end_time: Date | string
    actual_start_time?: Date | string | null
    actual_end_time?: Date | string | null
    is_operation: boolean
    is_stay_in: boolean
    is_personal: boolean
    is_out_of_coverage: boolean
    prepared_by_id: string
    status: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GasSlipCreateManyVehicleInput = {
    id?: string
    gas_slip_number: string
    driver_id: string
    gas_station_id: number
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TripTicketUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_ticket_approvers?: TripTicketApproverUpdateManyWithoutTrip_ticketNestedInput
  }

  export type TripTicketUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_ticket_approvers?: TripTicketApproverUncheckedUpdateManyWithoutTrip_ticketNestedInput
  }

  export type TripTicketUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    passengers?: StringFieldUpdateOperationsInput | string
    destination?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    actual_start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actual_end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_operation?: BoolFieldUpdateOperationsInput | boolean
    is_stay_in?: BoolFieldUpdateOperationsInput | boolean
    is_personal?: BoolFieldUpdateOperationsInput | boolean
    is_out_of_coverage?: BoolFieldUpdateOperationsInput | boolean
    prepared_by_id?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GasSlipUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_station?: GasStationUpdateOneRequiredWithoutGas_slipsNestedInput
    fuel_type?: FuelTypeUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_slip_approvers?: GasSlipApproverUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TripTicketApproverCreateManyTrip_ticketInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUpdateWithoutTrip_ticketInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUncheckedUpdateWithoutTrip_ticketInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TripTicketApproverUncheckedUpdateManyWithoutTrip_ticketInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverCreateManyGas_slipInput = {
    id?: string
    approver_id: string
    date_approval?: Date | string | null
    notes: string
    status: number
    label: string
    order: number
    updated_by?: string | null
    updated_at?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUpdateWithoutGas_slipInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUncheckedUpdateWithoutGas_slipInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipApproverUncheckedUpdateManyWithoutGas_slipInput = {
    id?: StringFieldUpdateOperationsInput | string
    approver_id?: StringFieldUpdateOperationsInput | string
    date_approval?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GasSlipCreateManyGas_stationInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    fuel_type_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GasSlipUpdateWithoutGas_stationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutGas_slipsNestedInput
    fuel_type?: FuelTypeUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_slip_approvers?: GasSlipApproverUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateWithoutGas_stationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateManyWithoutGas_stationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    fuel_type_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GasSlipCreateManyFuel_typeInput = {
    id?: string
    gas_slip_number: string
    vehicle_id: string
    driver_id: string
    gas_station_id: number
    requested_by_id: string
    with_container: boolean
    liter_in_text: string
    actual_liter?: number | null
    price_per_liter?: number | null
    purpose: string
    is_posted?: boolean
    print_count?: number
    cancelled_by?: string | null
    created_by: string
    updated_by?: string | null
    cancelled_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GasSlipUpdateWithoutFuel_typeInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_station?: GasStationUpdateOneRequiredWithoutGas_slipsNestedInput
    gas_slip_approvers?: GasSlipApproverUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateWithoutFuel_typeInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    gas_slip_approvers?: GasSlipApproverUncheckedUpdateManyWithoutGas_slipNestedInput
  }

  export type GasSlipUncheckedUpdateManyWithoutFuel_typeInput = {
    id?: StringFieldUpdateOperationsInput | string
    gas_slip_number?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    driver_id?: StringFieldUpdateOperationsInput | string
    gas_station_id?: IntFieldUpdateOperationsInput | number
    requested_by_id?: StringFieldUpdateOperationsInput | string
    with_container?: BoolFieldUpdateOperationsInput | boolean
    liter_in_text?: StringFieldUpdateOperationsInput | string
    actual_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    price_per_liter?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: StringFieldUpdateOperationsInput | string
    is_posted?: BoolFieldUpdateOperationsInput | boolean
    print_count?: IntFieldUpdateOperationsInput | number
    cancelled_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use VehicleCountOutputTypeDefaultArgs instead
     */
    export type VehicleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VehicleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TripTicketCountOutputTypeDefaultArgs instead
     */
    export type TripTicketCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TripTicketCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GasSlipCountOutputTypeDefaultArgs instead
     */
    export type GasSlipCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GasSlipCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GasStationCountOutputTypeDefaultArgs instead
     */
    export type GasStationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GasStationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FuelTypeCountOutputTypeDefaultArgs instead
     */
    export type FuelTypeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FuelTypeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VehicleDefaultArgs instead
     */
    export type VehicleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VehicleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TripTicketDefaultArgs instead
     */
    export type TripTicketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TripTicketDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TripTicketApproverDefaultArgs instead
     */
    export type TripTicketApproverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TripTicketApproverDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GasSlipDefaultArgs instead
     */
    export type GasSlipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GasSlipDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GasSlipApproverDefaultArgs instead
     */
    export type GasSlipApproverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GasSlipApproverDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GasStationDefaultArgs instead
     */
    export type GasStationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GasStationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FuelTypeDefaultArgs instead
     */
    export type FuelTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FuelTypeDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}