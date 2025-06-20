
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64 } from '../__common__/helpers';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as hbs from 'hbs';
import { Employee } from 'apps/system/src/employee/entities/employee.entity';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class McrtReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async get_summary_data(payload: {
        start_date: Date,
        end_date: Date,
        authUser: AuthUser,
    }) {
        const { start_date, end_date, authUser } = payload;

        const mcrts = await this.prisma.mCRT.findMany({
            where: {
                created_at: {
                    gte: start_date,
                    lte: end_date,
                },
                approval_status: APPROVAL_STATUS.APPROVED,
                is_completed: true,
            },
            select: {
                mcrt_number: true,
                mcrt_date: true,
                mct: {
                    select: {
                        mct_number: true,
                    }
                },
                returned_by_id: true,
                note: true,
                mcrt_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                code: true,
                                old_code: true,
                                description: true,
                                unit: {
                                    select: {
                                        name: true,
                                    }
                                },
                            }
                        }
                    },
                    orderBy: {
                        item: {
                            code: 'asc',
                        }
                    }
                },
            },
            orderBy: {
                mcrt_number: 'asc',
            },
        });

        const grouped = mcrts.reduce((acc, mcrt) => {
            if (!acc[mcrt.mcrt_number]) {
                acc[mcrt.mcrt_number] = [];
            }
            acc[mcrt.mcrt_number].push(mcrt);
            return acc;
        }, {} as Record<string, typeof mcrts>);

        return grouped;
    }

    async getEmployees(authUser: AuthUser): Promise<{
        employees: Employee[],
    }> {

        const query = `
            query {
                employees(page: 1, pageSize: 1000) {
                    data {
                        id
                        firstname 
                        middlename 
                        lastname
                    }
                },
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

            if(!data || !data.data) {
                return undefined
            }

            const undefined_employees = !data.data.employees || !data.data.employees.data

            if (undefined_employees) {
                return undefined;
            }

            return {
                employees: data.data.employees.data,
            }


        } catch (error) {
            return undefined;
        }
    }

}
