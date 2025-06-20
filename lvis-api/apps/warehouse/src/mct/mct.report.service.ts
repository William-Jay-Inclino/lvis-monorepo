
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { APPROVAL_STATUS } from '../__common__/types';
import { Employee } from 'apps/system/src/employee/entities/employee.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class MctReportService {

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

        const start = startOfDay(start_date);
        const end = endOfDay(end_date);

        const mcts = await this.prisma.mCT.findMany({
            where: {
                mct_date: {
                    gte: start,
                    lte: end,
                },
                approval_status: APPROVAL_STATUS.APPROVED,
                is_completed: true,
            },
            select: {
                mct_number: true,
                mct_date: true,
                mrv: {
                    select: {
                        or_number: true,
                        mwo_number: true,
                        cwo_number: true,
                        jo_number: true,
                        purpose: true,
                        withdrawn_by_id: true,
                        mrv_items: {
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
                                        project_item: {
                                            select: {
                                                project: {
                                                    select: {
                                                        name: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            orderBy: {
                                item: {
                                    code: 'asc',
                                }
                            }
                        }
                    }
                }

            },
            orderBy: {
                mct_number: 'asc',
            },
        });

        // Group by seriv_number
        const grouped = mcts.reduce((acc, mct) => {
            if (!acc[mct.mct_number]) {
                acc[mct.mct_number] = [];
            }
            acc[mct.mct_number].push(mct);
            return acc;
        }, {} as Record<string, typeof mcts>);

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
