import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'apps/warehouse/prisma/generated/client';
// import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){

        super({
            datasources: {
                db: {
                    url: config.get('WAREHOUSE_DATABASE_URL'),
                }
            },
            // log: ['query']
        })
    }
}
