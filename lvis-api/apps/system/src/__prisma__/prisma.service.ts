import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { convertDatesToPhTime } from "../__common__/utils";
import { PrismaClient } from "apps/system/prisma/generated/client";


function extendPrismaClient(config: ConfigService) {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: config.get('SYSTEM_DATABASE_URL'),
            },
        },
    });
  
    return prisma.$extends({
        query: {
            $allModels: {
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

