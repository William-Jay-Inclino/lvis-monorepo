import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from "apps/powerserve/prisma/generated/client";
import { convertDatesToPhTime } from "apps/system/src/__common__/utils";


/*

    I Refactor the code so that I can use prisma extends. This is just a work around. Prisma team is working on this
    Note: Prisma documentation for $extends is not working

*/

function extendPrismaClient(config: ConfigService) {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: config.get('POWERSERVE_DATABASE_URL'),
            },
        },
    });
  
    return prisma.$extends({
        query: {
            $allModels: {
                // async $allOperations({ operation, model, args, query }) {
                //     const start = performance.now();
                //     const result = await query(args);
                //     const end = performance.now();
                //     const time = end - start;
                //     Logger.log(`${model}.${operation} took ${time.toFixed(2)} ms`);
                //     return result;
                // },
                async findMany({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                },
                async findUnique({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                },
                async findFirst({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                },
                async update({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                },
                async create({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                },
                async delete({ args, query }) {
                    const result = await query(args);
                    return convertDatesToPhTime(result);
                }
            },
        },
    });
}

  
const ExtendedPrismaClient = class {
    constructor(config: ConfigService) {
        return extendPrismaClient(config);
    }
} as new (config: ConfigService) => ReturnType<typeof extendPrismaClient>;

  
  
@Injectable()
export class PrismaService extends ExtendedPrismaClient {
    constructor(config: ConfigService) {
        super(config); 
    }
}
