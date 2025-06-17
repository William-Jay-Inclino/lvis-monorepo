
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles, formatToPhpCurrency } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MST as M, MSTItem } from 'apps/warehouse/prisma/generated/client';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';
import { MST } from './entities/mst.entity';

@Injectable()
export class MstPdfService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generatePdf(mst: MST, metadata: { ip_address: string, device_info: any, authUser: AuthUser }) {
        const authUser = metadata.authUser

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(mst.mst_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, authUser);
            return i;
        }));

        const [returned_by] = await Promise.all([
            this.getEmployee(mst.returned_by_id, authUser),
        ])

        // Set content of the PDF
        const content = `

        <style>
            body {
                font-family: Arial, sans-serif; 
                font-size: 8pt;
                margin: 0;
                padding: 0;
            }
                
            .content {
                font-family: 'Verdana', sans-serif; 
                display: flex;
                flex-direction: column;
                padding-left: 25px;
                padding-right: 25px;
            }

            .heading {
                font-family: 'Georgia', serif; 
                font-size: 11pt;
                font-weight: bold;
            }

            .watermark {
                position: fixed;
                top: 50%;
                left: 60%;
                transform: translate(-50%, -50%);
                width: 70%;
                height: 70%;
                z-index: -1;
                background-image: url('data:image/jpeg;base64,${watermark}');
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
            }
            .responsive-signature {
                width: auto;
                height: auto;
                max-width: 150px;
                max-height: 150px;
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
            }

            .item-table {
                width: 100%;
                font-size: 8pt;
                border: 1px solid black;
                border-collapse: collapse;
            }
            .item-table th, 
            .item-table td {
                padding: 5px;
                border: 1px solid black;
                vertical-align: middle;
            }
        </style>

        
        <div class="watermark"></div>

        <div class="content">

            <div style="flex-grow: 1;">
        
                <div style="text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <img src="data:image/jpeg;base64,${logo}" alt="Logo" style="height: 50px; width: 50px; margin-right: 10px;">
                            <div style="text-align: center;">
                                <span class="heading">LEYTE V ELECTRIC COOPERATIVE, INC.</span>
                                <div style="font-size: 9pt;">
                                    <span>Brgy. San Pablo, Ormoc City, Leyte</span>
                                    <br />
                                    <span>VAT REG. TIN 001-383-331-000</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        
                    </div>
                </div>

                <br />

                <div style="display: flex; justify-content: flex-end;">

                    <div>
                        <table style="font-size: 8pt; width: 200px;">
                            <tr>
                                <td style="width: 50%">MST No.:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center">
                                    ${ mst.mst_number } 
                                </td>
                            </tr>     
                            <tr>
                                <td>Date:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${formatDate(mst.mst_date)} </td>
                            </tr>
                        </table>
                    </div>
                
                </div>

                <br />
                <div class="heading" style="text-align: center;"> MATERIAL SALVAGE TICKET </div>
                <br />
                <br />

                <table border="0" style="width: 100%; font-size: 9pt; border-collapse: collapse; ">
                    <tbody>
                        <tr>
                            <td style="width: 20%;"> Remarks </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; padding-top: 10px; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line; padding-left: 10px;">${ mst.remarks }</td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />

                <table border="0" class="item-table">
                    <thead>
                        <th style="border: 1px solid black; width: 5%"> No. </th>
                        <th style="border: 1px solid black; white-space: nowrap;"> Item Code </th>
                        <th style="border: 1px solid black;"> Description </th>
                        <th style="border: 1px solid black; width: 5%"> Qty </th>
                        <th style="border: 1px solid black;"> Unit </th>
                        <th style="border: 1px solid black; width: 15%"> Price </th>
                        <th style="border: 1px solid black; width: 15%"> Total </th>
                    </thead>
                    <tbody>
                        ${mst.mst_items.map((mst_item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center" style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle;">${index + 1}</td>
                            <td style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle; white-space: nowrap;">${mst_item.item.code}</td>
                            <td style="white-space: pre-line; padding-top: 10px; padding-bottom: 10px; vertical-align: middle;">${mst_item.item.description} ${ mst_item.item.project_item ? `(${ mst_item.item.project_item.project.name })` : '' }</td>
                            <td style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle; white-space: nowrap;" align="center">${mst_item.quantity}</td>
                            <td style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle; white-space: nowrap;" align="center">${mst_item.item.unit.name}</td>
                            <td style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle; white-space: nowrap;" align="center">${formatToPhpCurrency(mst_item.price)}</td>
                            <td style="padding-top: 10px; padding-bottom: 10px; vertical-align: middle; white-space: nowrap;" align="center">${formatToPhpCurrency(mst_item.price * mst_item.quantity)}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" style="font-weight: bold; padding-top: 10px; padding-bottom: 10px; vertical-align: middle;">Total no. of records: ${ mst.mst_items.length }</td>
                            <td style="font-weight: bold;  text-align: right; padding-top: 10px; padding-bottom: 10px; vertical-align: middle;">GRAND TOTAL:</td>
                            <td style="font-weight: bold; text-align: center; padding-top: 10px; padding-bottom: 10px; vertical-align: middle;">${ this.get_grand_total_price(mst.mst_items) }</td>
                        </tr>
                    </tfoot>
                </table>

                <br />
                <br />

        
            </div>
        
            <div padding-top: 30px; display: flex; justify-content: center;">

                <div style="display: flex; flex-wrap: wrap; page-break-inside: avoid;">
                    
                    <div style="padding: 10px; width: 45%; padding-top: 30px;"> 
                    
                        <table border="0" style="width: 100%; font-size: 8pt; page-break-inside: avoid; position: relative;">
                            <tr>
                                <td> Returned By: </td>
                            </tr>
                            <tr>
                                <td> ${formatDate(mst.mst_date)} </td>
                            </tr>
                            <tr>
                                <th style="text-align: center; position: relative; font-size: 10pt;">
                                    <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                        ${
                                            // @ts-ignore
                                            getFullnameWithTitles(returned_by.firstname, returned_by.lastname, returned_by.middlename, returned_by.name_prefix, returned_by.name_suffix)
                                        }
                                    </u>
                                    <img class="responsive-signature" src="${ 
                                        // @ts-ignore
                                        this.getUploadsPath(returned_by.signature_src)
                                    }" />
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    ${
                                        // @ts-ignore
                                        returned_by.position ? returned_by.position : ''
                                    }
                                </td>
                            </tr>
                        </table>

                    </div>
                
                ${approvers.map((item, index) => `
                
                    <div style="padding: 10px; width: 45%; padding-top: 30px;">
                        <table border="0" style="width: 100%; font-size: 8pt; page-break-inside: avoid; position: relative;">
                            <tr>
                                <td> ${ item.label === 'Warehouse Custodian' ? 'Issued By' : item.label }: </td>
                            </tr>
                            <tr>
                                <td> ${formatDate(item.date_approval, true)} </td>
                            </tr>
                            <tr>
                                <th style="text-align: center; position: relative; font-size: 10pt;">
                                    <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                        ${
                                            // @ts-ignore
                                            getFullnameWithTitles(item.approver.firstname, item.approver.lastname, item.approver.middlename, item.approver.name_prefix, item.approver.name_suffix)
                                        }
                                    </u>
                                    <img class="responsive-signature" src="${ 
                                        // @ts-ignore
                                        this.getUploadsPath(item.approver.signature_src)
                                    }" />
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    ${
                                        // @ts-ignore
                                        item.approver.position ? item.approver.position : ''
                                    }
                                </td>
                            </tr>
                        </table>
                    </div>

                `).join('')}

                </div>
                    
            </div>
        
        
        </div>
          
        `;

        await page.setContent(content);

        const pdfArrayBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: `<div style="width: 100%; font-size: 0;"></div>`,
            footerTemplate: `
            <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
                padding: 5px 5px 0; color: #bbb; position: relative;">
                <div style="position: absolute; left: 5px; top: 5px;">
                    Note: System generated report | Created by: <b>${ mst.created_by }</b> | Printed by: <b>${authUser.user.username}</b> | 
                    Date & Time: <b><span class="date"></span></b>
                </div>
                <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
            </div>
          `,
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px', top: '60px' },
        });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.MST,
            action: 'PRINT-MST',
            reference_id: mst.mst_number,
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }
    
    private async getEmployee(employeeId: string, authUser: AuthUser) {


        const query = `
            query {
                employee(id: "${ employeeId }") {
                    id 
                    firstname 
                    middlename 
                    lastname
                    name_prefix
                    name_suffix
                    position
                    signature_src
                    department {
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

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    async findMst(id: string): Promise<M> {
        const item = await this.prisma.mST.findUnique({
            include: {
                mst_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                project_item: {
                                    include: {
                                        project: true
                                    }
                                },
                                code: true,
                                unit: true,
                                description: true,
                            }
                        },
                    },
                    orderBy: {
                        item: {
                            code: 'asc'
                        }
                    }
                },
                mst_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('MST not found')
        }

        // @ts-ignore
        return item
    }

    private get_grand_total_price(mst_items: MSTItem[]) {
    
        let total_price = 0

        for(let mst_item of mst_items) {
            total_price += mst_item.price * mst_item.quantity
        }

        return formatToPhpCurrency(total_price)
    } 

}
