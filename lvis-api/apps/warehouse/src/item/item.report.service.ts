import { Injectable } from "@nestjs/common";
import { PrismaService } from "../__prisma__/prisma.service";
import { WarehouseAuditService } from "../warehouse_audit/warehouse_audit.service";
import { HttpService } from "@nestjs/axios";
import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import puppeteer from "puppeteer";
import { formatDate, getImageAsBase64, formatToPhpCurrency } from "../__common__/helpers";
import { DB_TABLE } from "../__common__/types";
import { endOfDay, startOfDay } from "date-fns";



@Injectable()
export class ItemReportService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generate_item_transaction_summary_pdf(
        payload: {
            report_data: any, 
            startDate: string, 
            endDate: string, 
            title: string,
        },
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const { report_data, startDate, endDate, title } = payload 

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

                <div style="text-align: center;">
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
                                <th>Date</th>
                                <th>Time</th>
                                <th style="white-space: nowrap; width: 10%">Item Code</th>
                                <th>Description</th>
                                <th>Unit</th>
                                <th>Quantity</th>
                                <th style="white-space: nowrap;">Unit Price</th>
                                <th style="white-space: nowrap;">Total Price</th>
                                <th style="white-space: nowrap;">In/Out</th>
                                <th style="white-space: nowrap;">Reference No.</th>
                                <th style="white-space: nowrap;">Starting Balance</th>
                                <th style="white-space: nowrap;">Ending Balance</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>

                        <tbody style="font-size: 8pt;">
                            ${report_data.map((item: any) => {
                                return `
                                <tr>
                                    <td>${ ctr++ }</td>
                                    <td style="white-space: nowrap;">${ item.date }</td>
                                    <td style="white-space: nowrap;">${ item.time }</td>
                                    <td>${ item.item_code }</td>
                                    <td style="font-size: 7pt; white-space: pre-line;">${ item.description }</td>
                                    <td style="white-space: nowrap;">${ item.unit }</td>
                                    <td style="white-space: nowrap;">${ item.quantity }</td>
                                    <td style="white-space: nowrap;">${ formatToPhpCurrency(item.unit_price) }</td>
                                    <td style="white-space: nowrap;">${ formatToPhpCurrency(item.total_price) }</td>
                                    <td style="white-space: nowrap;">${ item.type }</td>
                                    <td style="font-size: 7pt; white-space: nowrap;">${ item.reference_number }</td>
                                    <td style="white-space: nowrap;">${ item.starting_balance }</td>
                                    <td style="white-space: nowrap;">${ item.ending_balance }</td>
                                    <td style="font-size: 7pt;">${ item.remarks }</td>
                                </tr>
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
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px', top: '55px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.ITEM_TRANSACTION,
            action: 'PRINT-ITEM-TRANSACTIONS-SUMMARY',
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

    async generate_item_transaction_by_code_summary_pdf(
        payload: {
            report_data: any, 
            startDate: string, 
            endDate: string, 
            title: string,
        },
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const { report_data, startDate, endDate, title } = payload 
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

                <div style="text-align: center;">
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
                                <th style="white-space: nowrap; width: 10%">Item Code</th>
                                <th>Description</th>
                                <th>Unit</th>
                                <th style="white-space: nowrap;">Average Price</th>
                                <th style="white-space: nowrap;">Starting Balance</th>
                                <th style="white-space: nowrap;">Ending Balance</th>
                            </tr>
                        </thead>

                        <tbody style="font-size: 8pt;">
                            ${report_data.map((item: any) => {
                                return `
                                <tr>
                                    <td>${ ctr++ }</td>
                                    <td>${ item.item_code }</td>
                                    <td style="font-size: 7pt; white-space: pre-line;">${ item.description }</td>
                                    <td style="white-space: nowrap;">${ item.unit }</td>
                                    <td style="white-space: nowrap;">${ formatToPhpCurrency(item.avg_price) }</td>
                                    <td style="white-space: nowrap;">${ item.starting_balance }</td>
                                    <td style="white-space: nowrap;">${ item.ending_balance }</td>
                                </tr>
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
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px', top: '55px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.ITEM_TRANSACTION,
            action: 'PRINT-ITEM-TRANSACTIONS-BY-CODE-SUMMARY',
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

    async generate_item_transaction_summary_data(
        payload: { 
            startDate: string, 
            endDate: string,
            item_type_ids: number[]
        }) 
    {

        console.log('generate_item_transaction_summary_data', payload);
    
        const { startDate, endDate, item_type_ids } = payload;

        const start = startOfDay(startDate);
        const end = endOfDay(endDate);
    
        const result = await this.prisma.$queryRaw`
            WITH starting_balance_cte AS (
                SELECT 
                    it.item_id, 
                    COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS starting_balance
                FROM item_transaction it
                WHERE it.created_at < ${start}::date
                GROUP BY it.item_id
            ),
        
            ending_balance_cte AS (
                SELECT 
                    it.item_id, 
                    COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS ending_balance
                FROM item_transaction it
                WHERE it.created_at <= ${end}::date
                GROUP BY it.item_id
            )
        
            SELECT
                TO_CHAR(it.created_at, 'DD Mon YYYY') AS date,
                TO_CHAR(it.created_at, 'HH12:MI AM') AS time,
                i.code AS item_code, 
                i.description, 
                i.item_type_id,
                itype.name AS item_type, 
                unit.name AS unit,
                it.quantity,
                it.price AS unit_price,
                it.price * it.quantity AS total_price,
                (CASE WHEN it.type = 1 THEN 'Stock In' ELSE 'Stock Out' END) AS "type",
                CASE 
                    WHEN it.rr_item_id IS NOT NULL THEN CONCAT('RR#', rr.rr_number)
                    WHEN it.osriv_item_id IS NOT NULL THEN CONCAT('OSRIV#', osriv.osriv_number)
                    WHEN it.seriv_item_id IS NOT NULL THEN CONCAT('SERIV#', seriv.seriv_number)
                    WHEN it.mrv_item_id IS NOT NULL THEN CONCAT('MCT#', mct.mct_number)
                    WHEN it.mcrt_item_id IS NOT NULL THEN CONCAT('MCRT#', mcrt.mcrt_number)
                    WHEN it.mst_item_id IS NOT NULL THEN CONCAT('MST#', mst.mst_number)
                    ELSE 'N/A'  
                END AS reference_number,
                COALESCE(sb.starting_balance, 0) AS starting_balance,
                COALESCE(eb.ending_balance, 0) AS ending_balance,
                it.remarks
            FROM item_transaction it
            INNER JOIN item i ON i.id = it.item_id
            LEFT JOIN starting_balance_cte sb ON sb.item_id = it.item_id
            LEFT JOIN ending_balance_cte eb ON eb.item_id = it.item_id
            LEFT JOIN item_type itype ON itype.id = i.item_type_id  
            LEFT JOIN unit unit ON unit.id = i.unit_id            
            LEFT JOIN rr_item ON rr_item.id = it.rr_item_id             
            LEFT JOIN osriv_item ON osriv_item.id = it.osriv_item_id 
            LEFT JOIN seriv_item ON seriv_item.id = it.seriv_item_id  
            LEFT JOIN mrv_item ON mrv_item.id = it.mrv_item_id          
            LEFT JOIN mcrt_item ON mcrt_item.id = it.mcrt_item_id      
            LEFT JOIN mst_item ON mst_item.id = it.mst_item_id     
            LEFT JOIN receiving_report rr ON rr.id = rr_item.rr_id
            LEFT JOIN osriv ON osriv.id = osriv_item.osriv_id
            LEFT JOIN seriv ON seriv.id = seriv_item.seriv_id
            LEFT JOIN mrv ON mrv.id = mrv_item.mrv_id
            LEFT JOIN mct ON mct.mrv_id = mrv.id
            LEFT JOIN mcrt ON mcrt.id = mcrt_item.mcrt_id
            LEFT JOIN mst ON mst.id = mst_item.mst_id
            WHERE it.created_at BETWEEN ${start}::date AND ${end}::date
            ORDER BY date, time DESC;
        `;
        
        return this.filterItemTypes(result as any, item_type_ids);
    }
    
    async generate_item_transaction_by_code_summary_data(
        payload: { 
            startDate: string, 
            endDate: string,
            item_type_ids: number[],
        }) {

        console.log('generate_item_transaction_by_code_summary_data', payload);
    
        const { startDate, endDate, item_type_ids } = payload;

        const start = startOfDay(startDate);
        const end = endOfDay(endDate);
    
        const result = await this.prisma.$queryRaw`
            WITH starting_balance_cte AS (
                SELECT 
                    it.item_id, 
                    COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS starting_balance
                FROM item_transaction it
                WHERE it.created_at < ${start}::date
                GROUP BY it.item_id
            ),

            ending_balance_cte AS (
                SELECT 
                    it.item_id, 
                    COALESCE(SUM(CASE WHEN it.type = 1 THEN it.quantity ELSE -it.quantity END), 0) AS ending_balance
                FROM item_transaction it
                WHERE it.created_at <= ${end}::date
                GROUP BY it.item_id
            )

            SELECT
                i.code AS item_code, 
                i.description, 
                i.item_type_id,
                itype.name AS item_type, 
                unit.name AS unit,       
                AVG(it.price) AS avg_price, 
                COALESCE(sb.starting_balance, 0) AS starting_balance,
                COALESCE(eb.ending_balance, 0) AS ending_balance
            FROM item_transaction it
            INNER JOIN item i ON i.id = it.item_id
            LEFT JOIN starting_balance_cte sb ON sb.item_id = it.item_id
            LEFT JOIN ending_balance_cte eb ON eb.item_id = it.item_id
            LEFT JOIN item_type itype ON itype.id = i.item_type_id  
            LEFT JOIN unit unit ON unit.id = i.unit_id              
            WHERE it.created_at BETWEEN ${start}::date AND ${end}::date
            GROUP BY 
                i.code, i.description, i.item_type_id, itype.name, unit.name, i.total_quantity, sb.starting_balance, eb.ending_balance
            ORDER BY i.code ASC;
        `;
        
        return this.filterItemTypes(result as any, item_type_ids);
    }

    private filterItemTypes(
        data: any[], 
        item_type_ids: number[]
    ): any[] {
        return data.filter(item => item_type_ids.includes(item.item_type_id));
    }

}