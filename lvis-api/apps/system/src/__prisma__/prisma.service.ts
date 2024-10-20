import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'apps/system/prisma/generated/client';
// import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){

        console.log("config.get('DATABASE_URL')", config.get('SYSTEM_DATABASE_URL'))

        super({
            datasources: {
                db: {
                    url: config.get('SYSTEM_DATABASE_URL'),
                }
            }
        })
    }
}
