import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'apps/system/prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){

        super({
            datasources: {
                db: {
                    url: config.get('SYSTEM_DATABASE_URL'),
                }
            }
        })
    }
}
