
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64 } from '../__common__/helpers';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { APPROVAL_STATUS, DB_TABLE } from '../__common__/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as hbs from 'hbs';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class SerivReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generate_seriv_summary_pdf(
        payload: {
            startDate: string, 
            endDate: string, 
            title: string,
        },
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {
        const { startDate, endDate, title } = payload;
        
        const authUser = metadata.authUser;

        // Fetch grouped data
        const groupedSerivs = await this.get_summary_data({
            start_date: new Date(startDate),
            end_date: new Date(endDate),
        });

        const logo = getImageAsBase64('leyeco-logo.png');

        hbs.handlebars.registerHelper('formatDate', function(value) {
            return value ? formatDate(value) : 'N/A';
        });

        hbs.handlebars.registerHelper('na', function(value) {
            return (value === undefined || value === null || value === '') ? 'N/A' : value;
        });

        hbs.handlebars.registerHelper('currency', function (value) {
            if (typeof value !== 'number') return value;
            return value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
        });
        hbs.handlebars.registerHelper('multiply', function(a, b) {
            return (a || 0) * (b || 0);
        });
        hbs.handlebars.registerHelper('grandTotal', function(items) {
            let total = 0;
            for (const item of items) {
                total += (item.price || 0) * (item.quantity || 0);
            }
            return total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
        });

        const rawHtml = readFileSync(
            join(process.cwd(), 'apps/warehouse/src/seriv/seriv.html'),
            'utf8'
        );
        const template = hbs.handlebars.compile(rawHtml);

        const html = template({
            title: `${title} (${formatDate(startDate)} to ${formatDate(endDate)})`,
            date: new Date().toLocaleDateString(),
            serivs: groupedSerivs,
            logo, // pass logo if you want to use it in the template
        });

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setContent(html);

        const pdfArrayBuffer = await page.pdf({
            // landscape: true,
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: `<div style="width: 100%; font-size: 0;"></div>`,
            footerTemplate: `
            <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
                padding: 5px 5px 0; color: #bbb; position: relative;">
                <div style="position: absolute; left: 5px; top: 5px;">
                    Note: System generated report | Printed by: <b>${authUser.user.username}</b> | 
                    Date & Time: <b><span class="date"></span></b>
                </div>
                <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
            </div>
            `,
            margin: { bottom: '70px', top: '60px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // ...audit and return as before...
        return pdfBuffer;
    }

    async get_summary_data(payload: {
        start_date: Date,
        end_date: Date,
    }) {
        const { start_date, end_date } = payload;

        const start = startOfDay(start_date);
        const end = endOfDay(end_date);

        const serivs = await this.prisma.sERIV.findMany({
            where: {
                date_requested: {
                    gte: start,
                    lte: end,
                },
                approval_status: APPROVAL_STATUS.APPROVED,
                is_completed: true,
            },
            select: {
                seriv_number: true,
                date_requested: true,
                purpose: true,
                or_number: true,
                mwo_number: true,
                cwo_number: true,
                jo_number: true,
                consumer_name: true,
                location: true,
                created_by: true,
                seriv_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                code: true,
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
                seriv_number: 'asc',
            },
        });

        // Group by seriv_number
        const grouped = serivs.reduce((acc, seriv) => {
            if (!acc[seriv.seriv_number]) {
                acc[seriv.seriv_number] = [];
            }
            acc[seriv.seriv_number].push(seriv);
            return acc;
        }, {} as Record<string, typeof serivs>);

        return grouped;
    }

}
