
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles, formatToPhpCurrency } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { OSRIV as O, OSRIVItem } from 'apps/warehouse/prisma/generated/client';
import { OSRIV } from './entities/osriv.entity';
import { warehouseRequestTypeMapper } from '../__common__/constants';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class OsrivReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generateOsrivSummaryReport(filters: {
        startDate: Date,
        endDate: Date,
        departmentIds: string[],
        requested_by_id: string,
    }, authUser: AuthUser) {

        const employees = await this.getEmployees(authUser)

        console.log('employees', employees);

    }

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    private async getEmployees(authUser: AuthUser) {

        const query = `
            query {
                employees {
                    firstname 
                    middlename 
                    lastname
                    department {
                        id
                        name
                    }
                }
            }
        `;

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
                    process.env.API_GATEWAY_URL,
                    { query },
                    {
                        headers: {
                            Authorization: authUser.authorization,
                            'Content-Type': 'application/json',
                        },
                    }
                ).pipe(
                    catchError((error) => {
                        throw error;
                    }),
                ),
            );

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.employee;

        } catch (error) {
            return undefined;
        }
    }

}
