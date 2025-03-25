
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, formatToPhpCurrency, getFullname, getFullnameWithTitles } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Employee } from 'apps/system/src/employee/entities/employee.entity';
import { Department } from 'apps/system/src/department/entities/department.entity';
import { approvalStatus } from '../__common__/constants';

@Injectable()
export class OsrivReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generate_osriv_summary_pdf_by_departments(
        payload: {
            report_data: any, 
            startDate: string, 
            endDate: string, 
            title: string,
        },
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const { report_data, startDate, endDate, title } = payload 
        console.log('report_data', report_data);
        const authUser = metadata.authUser

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        let ctr = 1

        // Set content of the PDF
        const content = `


        <style>
            body {
                font-family: Arial, sans-serif; 
                font-size: 9pt;
                margin: 0;
                padding: 0;
            }
                
            .content {
                font-family: 'Verdana', sans-serif; 
                display: flex;
                flex-direction: column;
                padding-left: 10px;
                padding-right: 10px;
            }

            .heading {
                font-family: 'Georgia', serif; 
                font-size: 12pt;
                font-weight: bold;
            }

            .watermark {
                position: fixed;
                top: 50%;
                left: 57%;
                transform: translate(-50%, -50%);
                width: 70%;
                height: 70%;
                z-index: -1;
                background-image: url('data:image/jpeg;base64,${watermark}');
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
            }

            .logo {
                height: 50px;
                width: 50px;
                margin-right: 10px;
            }

            .header-container {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .header-text {
                text-align: center;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9pt;
            }

            th, td {
                border: 1px solid black;
                padding: 5px;
                text-align: center;
                font-weight: normal;
                vertical-align: middle;
            }

            thead th {
                padding: 2.5px 5px; 
                line-height: 1; 
                font-weight: bold;
            }

            .text-muted {
                color: #6c757d;
            }

        </style>

        
        <div class="watermark"></div>

        <div class="content">

            <div style="flex-grow: 1;">

                <div style="text-align: center; margin-top: 15px;">
                    <div class="header-container">
                        <img src="data:image/jpeg;base64,${logo}" alt="Logo" class="logo">
                        <div class="header-text">
                            <span class="heading">LEYTE V ELECTRIC COOPERATIVE, INC.</span>
                            <div style="font-size: 9pt;">
                                <span>Brgy. San Pablo, Ormoc City, Leyte</span>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div style="text-align: center; font-size: 10pt; font-weight: bold;"> ${ title } </div>
                    <span style="font-size: 9pt;"> From ${ formatDate(startDate) } to ${ formatDate(endDate) } </span>

                    <br />
                    <br />

                    <table style="font-size: 8pt;">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Requisitioner</th>
                                <th style="white-space: nowrap;">Osriv No.</th>
                                <th>Date</th>
                                <th style="white-space: nowrap;">Item Code</th>
                                <th style="white-space: nowrap;">Item Description</th>
                                <th style="white-space: nowrap;">Unit</th>
                                <th style="white-space: nowrap;">Quantity</th>
                                <th style="white-space: nowrap;">Unit Price</th>
                                <th style="white-space: nowrap;">Total Price</th>
                                <th style="white-space: nowrap;">Status</th>
                            </tr>
                        </thead>

                        <tbody style="font-size: 8pt;">
                            ${report_data.map((department: any) => {
                                return `
                                <tr>
                                    <td colspan="11" style="text-align: center; font-weight: bold;">
                                        ${ department.name.toUpperCase() } 
                                    </td>
                                </tr>
                                ${department.items.length === 0 ? `
                                <tr>
                                    <td colspan="11" style="text-align: center; font-style: italic;">No items</td>
                                </tr>
                                ` : department.items.map((item: any, indx: number) => `
                                <tr>
                                    <td>${ ctr++ }</td>
                                    <td style="white-space: nowrap;">${ item.requested_by_fullname }</td>
                                    <td style="white-space: nowrap;">${ item.osriv_number }</td>
                                    <td style="white-space: nowrap;">${ formatDate(item.date_requested) }</td>
                                    <td style="white-space: nowrap;">${ item.item_code }</td>
                                    <td style="white-space: pre-line;">${ item.item_description }</td>
                                    <td style="white-space: nowrap;">${ item.unit_name }</td>
                                    <td style="white-space: nowrap;">${ item.quantity }</td>
                                    <td style="white-space: nowrap;">${ item.unit_price_in_php_currency }</td>
                                    <td style="white-space: nowrap;">${ item.total_price_in_php_currency }</td>
                                    <td style="white-space: nowrap;">${ item.status }</td>
                                </tr>
                                `).join('')}
                                `;
                            }).join('')}
                        </tbody>

                    </table>

                </div>
            </div>
        </div>
            
        `;

        await page.setContent(content);

        const pdfArrayBuffer = await page.pdf({
            landscape: true,
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: ``,
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
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.OSRIV,
            action: 'PRINT-OSRIV-SUMMARY',
            reference_id: 'N/A',
            metadata: {
                'start_date': startDate,
                'end_date': endDate,
                'report_title': title,
            },
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }

    async generate_osriv_summary_pdf_by_requisitioner(
        payload: {
            report_data: any, 
            startDate: string, 
            endDate: string, 
            title: string,
            requested_by_fullname: string,
            department_code: string,
        },
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const { report_data, startDate, endDate, title, requested_by_fullname, department_code } = payload 
        console.log('report_data', report_data);
        const authUser = metadata.authUser

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        let ctr = 1

        // Set content of the PDF
        const content = `


        <style>
            body {
                font-family: Arial, sans-serif; 
                font-size: 9pt;
                margin: 0;
                padding: 0;
            }
                
            .content {
                font-family: 'Verdana', sans-serif; 
                display: flex;
                flex-direction: column;
                padding-left: 10px;
                padding-right: 10px;
            }

            .heading {
                font-family: 'Georgia', serif; 
                font-size: 12pt;
                font-weight: bold;
            }

            .watermark {
                position: fixed;
                top: 50%;
                left: 57%;
                transform: translate(-50%, -50%);
                width: 70%;
                height: 70%;
                z-index: -1;
                background-image: url('data:image/jpeg;base64,${watermark}');
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
            }

            .logo {
                height: 50px;
                width: 50px;
                margin-right: 10px;
            }

            .header-container {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .header-text {
                text-align: center;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9pt;
            }

            th, td {
                border: 1px solid black;
                padding: 5px;
                text-align: center;
                font-weight: normal;
                vertical-align: middle;
            }

            thead th {
                padding: 2.5px 5px; 
                line-height: 1; 
                font-weight: bold;
            }

            .text-muted {
                color: #6c757d;
            }

        </style>

        
        <div class="watermark"></div>

        <div class="content">

            <div style="flex-grow: 1;">

                <div style="text-align: center; margin-top: 15px;">
                    <div class="header-container">
                        <img src="data:image/jpeg;base64,${logo}" alt="Logo" class="logo">
                        <div class="header-text">
                            <span class="heading">LEYTE V ELECTRIC COOPERATIVE, INC.</span>
                            <div style="font-size: 9pt;">
                                <span>Brgy. San Pablo, Ormoc City, Leyte</span>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div style="text-align: center; font-size: 10pt; font-weight: bold;"> ${ title } </div>
                    <div style="text-align: center; font-size: 9pt;"> Requested By ${ requested_by_fullname } of the ${ department_code } Department </div>
                    <span style="font-size: 9pt;"> From ${ formatDate(startDate) } to ${ formatDate(endDate) } </span>

                    <br />
                    <br />

                    <table style="font-size: 8pt;">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th style="white-space: nowrap;">Osriv No.</th>
                                <th>Date</th>
                                <th style="white-space: nowrap;">Item Code</th>
                                <th style="white-space: nowrap;">Item Description</th>
                                <th style="white-space: nowrap;">Unit</th>
                                <th style="white-space: nowrap;">Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody style="font-size: 8pt;">
                            ${report_data.map((item: any, index: number) => `
                                <tr style="border: 1px solid black;">
                                    <td align="center" style="padding: 8px 4px;">${index + 1}</td>
                                    <td style="white-space: pre-line; padding: 8px 4px;">${item.osriv_number}</td>
                                    <td style="white-space: nowrap;">${ formatDate(item.date_requested) }</td>
                                    <td style="white-space: nowrap;">${ item.item_code }</td>
                                    <td style="white-space: pre-line;">${ item.item_description }</td>
                                    <td style="white-space: nowrap;">${ item.unit_name }</td>
                                    <td style="white-space: nowrap;">${ item.quantity }</td>
                                    <td style="white-space: nowrap;">${ item.unit_price_in_php_currency }</td>
                                    <td style="white-space: nowrap;">${ item.total_price_in_php_currency }</td>
                                    <td style="white-space: nowrap;">${ item.status }</td>
                                </tr>
                            `).join('')}
                        </tbody>

                    </table>

                </div>
            </div>
        </div>
            
        `;

        await page.setContent(content);

        const pdfArrayBuffer = await page.pdf({
            landscape: true,
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: ``,
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
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.OSRIV,
            action: 'PRINT-OSRIV-SUMMARY',
            reference_id: 'N/A',
            metadata: {
                'start_date': startDate,
                'end_date': endDate,
                'report_title': title,
            },
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }

    async getSummaryByRequisitioner(filters: {
        startDate: Date,
        endDate: Date,
        requested_by_id: string | null,
    }, authUser: AuthUser): 
    Promise<{ 
        requested_by_fullname: string, 
        department_code: string, 
        reportData: any 
    }> {
        const { startDate, endDate, requested_by_id } = filters

        const employee = await this.getEmployee(requested_by_id, authUser)

        const osrivs = await this.prisma.oSRIV.findMany({
            where: {
                date_requested: {
                    gte: startDate,
                    lte: endDate,
                },
                requested_by_id
            },
            select: {
                osriv_number: true,
                date_requested: true,
                requested_by_id: true,
                approval_status: true,
                osriv_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                code: true,
                                description: true,
                                unit: true,
                                item_transactions: {
                                    select: {
                                        price: true,
                                        is_initial: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const items = []

        for(let osriv of osrivs) {

            for(let osrivItem of osriv.osriv_items) {

                const initial_item_transaction = osrivItem.item.item_transactions.find(i => i.is_initial)
                const price = initial_item_transaction ? initial_item_transaction.price : 0

                items.push({
                    requested_by_fullname: getFullname(employee.firstname, employee.middlename, employee.lastname),
                    osriv_number: osriv.osriv_number,
                    date_requested: osriv.date_requested,
                    item_code: osrivItem.item.code,
                    item_description: osrivItem.item.description,
                    unit_name: osrivItem.item.unit.name,
                    quantity: osrivItem.quantity,
                    unit_price_in_php_currency: formatToPhpCurrency(price),
                    total_price_in_php_currency: formatToPhpCurrency(price * osrivItem.quantity),
                    status: approvalStatus[osriv.approval_status].label,
                })

            }

        }

        return {
            requested_by_fullname: getFullnameWithTitles(employee.firstname, employee.lastname, employee.middlename, employee.name_prefix, employee.name_suffix),
            department_code: employee.department.code,
            reportData: items
        }
    }

    async getSummaryByDepartments(filters: {
        startDate: Date,
        endDate: Date,
        departmentIds: string[],
    }, authUser: AuthUser) {
        const { startDate, endDate, departmentIds } = filters
        const { employees, departments } = await this.getEmployeesAndDepartments(authUser)

        const osrivs = await this.prisma.oSRIV.findMany({
            where: {
                date_requested: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            select: {
                osriv_number: true,
                date_requested: true,
                requested_by_id: true,
                approval_status: true,
                osriv_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                code: true,
                                description: true,
                                unit: true,
                                item_transactions: {
                                    select: {
                                        price: true,
                                        is_initial: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const items = []

        const selected_departments = departments.filter(i => departmentIds.includes(i.id))

        for(let department of selected_departments) {

            const employeesByDepartment = employees.filter(i => i.department_id === department.id)
            
            const departmentItems = [] 

            for(let employee of employeesByDepartment) {

                const osrivsByEmployee = osrivs.filter(i => i.requested_by_id === employee.id)

                for(let osriv of osrivsByEmployee) {

                    for(let osrivItem of osriv.osriv_items) {

                        const initial_item_transaction = osrivItem.item.item_transactions.find(i => i.is_initial)
                        const price = initial_item_transaction ? initial_item_transaction.price : 0

                        departmentItems.push({
                            requested_by_fullname: getFullname(employee.firstname, employee.middlename, employee.lastname),
                            osriv_number: osriv.osriv_number,
                            date_requested: osriv.date_requested,
                            item_code: osrivItem.item.code,
                            item_description: osrivItem.item.description,
                            unit_name: osrivItem.item.unit.name,
                            quantity: osrivItem.quantity,
                            unit_price_in_php_currency: formatToPhpCurrency(price),
                            total_price_in_php_currency: formatToPhpCurrency(price * osrivItem.quantity),
                            status: approvalStatus[osriv.approval_status].label,
                        })

                    }

                }
            }

            items.push({
                code: department.code,
                name: department.name,
                items: departmentItems,
            })

        }

        return items
    }

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    private async getEmployeesAndDepartments(authUser: AuthUser): Promise<{
        employees: Employee[],
        departments: Department[],
    }> {

        const query = `
            query {
                employees(page: 1, pageSize: 1000) {
                    data {
                        id
                        firstname 
                        middlename 
                        lastname
                        department_id
                    }
                },
                departments {
                    id 
                    code 
                    name
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

            if(!data || !data.data) {
                return undefined
            }

            const undefined_employees = !data.data.employees || !data.data.employees.data
            const undefined_departments = !data.data.departments

            if (undefined_employees || undefined_departments) {
                return undefined;
            }

            return {
                employees: data.data.employees.data,
                departments: data.data.departments 
            }


        } catch (error) {
            return undefined;
        }
    }

    private async getEmployee(employeeId: string, authUser: AuthUser): Promise<Employee> {

        const query = `
            query {
                employee(id: "${ employeeId }") {
                    firstname 
                    middlename 
                    lastname
                    name_prefix
                    name_suffix
                    department {
                        id
                        code
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
