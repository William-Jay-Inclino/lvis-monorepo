// pdf.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, formatToPhpCurrency, getFullnameWithTitles, getImageAsBase64 } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PO } from './entities/po.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { VAT } from '../__common__/constants';
import { UPLOADS_PATH } from '../__common__/config';
import { MeqsSupplierItem } from '../meqs-supplier-item/entities/meqs-supplier-item.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class PoPdfService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'


    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generatePdf(po: PO, metadata: { ip_address: string, device_info: any }) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const totalPrice = po.meqs_supplier.meqs_supplier_items.reduce((acc, item) => acc + (item.price * Number(item.canvass_item.quantity)), 0);

        const approvers = await Promise.all(po.po_approvers.map(async (i) => {
            // @ts-ignore
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        const generalManager = approvers.pop()

        let requisitioner, classification_id, refType, refNumber, refDate, rc_number, purpose

        if(po.meqs_supplier.meqs.rv) {
            requisitioner = await this.getEmployee(po.meqs_supplier.meqs.rv.canvass.requested_by_id, this.authUser)
            classification_id = po.meqs_supplier.meqs.rv.classification_id
            refType = 'RV'
            refNumber = po.meqs_supplier.meqs.rv.rv_number
            refDate = po.meqs_supplier.meqs.rv.date_requested
            rc_number = po.meqs_supplier.meqs.rv.canvass.rc_number
            purpose = po.meqs_supplier.meqs.rv.canvass.purpose
        } else if(po.meqs_supplier.meqs.spr) {
            requisitioner = await this.getEmployee(po.meqs_supplier.meqs.spr.canvass.requested_by_id, this.authUser)
            classification_id = po.meqs_supplier.meqs.spr.classification_id
            refType = 'SPR'
            refNumber = po.meqs_supplier.meqs.spr.spr_number
            refDate = po.meqs_supplier.meqs.spr.date_requested
            rc_number = po.meqs_supplier.meqs.spr.canvass.rc_number
            purpose = po.meqs_supplier.meqs.spr.canvass.purpose
        } else {
            requisitioner = await this.getEmployee(po.meqs_supplier.meqs.jo.canvass.requested_by_id, this.authUser)
            classification_id = po.meqs_supplier.meqs.jo.classification_id
            refType = 'JO'
            refNumber = po.meqs_supplier.meqs.jo.jo_number
            refDate = po.meqs_supplier.meqs.jo.date_requested
            rc_number = po.meqs_supplier.meqs.jo.canvass.rc_number
            purpose = po.meqs_supplier.meqs.jo.canvass.purpose
        }

        const [classification, fundSource, items] = await Promise.all([
            this.getClassification(classification_id, this.authUser),
            this.getFundSource(po.fund_source_id, this.authUser),
            this.getAwardedItems(po.meqs_supplier.meqs_supplier_items, po.meqs_supplier.supplier)
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

            <div style="flex-grow: 1; min-height: 60vh;">
        
                <div style="text-align: center; margin-top: 35px;">
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
                        <br />
                        <div class="heading">PURCHASE ORDER</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: end;">
                    <table style="font-size: 8pt;">
                        <tr>
                            <td style="font-weight: bold;"> PO No.: </td>
                            <td style="border-bottom: 1px solid black;"> ${ po.po_number } </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;"> Date: </td>
                            <td style="border-bottom: 1px solid black;"> ${ formatDate(po.po_date) } </td>
                        </tr>
                    </table>
                </div>

                <table border="1" style="width: 100%; font-size: 8pt; border-collapse: collapse; border-color: black; margin-top: 10px;">
                    <tr>
                        <td rowspan="4" style="width: 50%; vertical-align: top;">
                            <div style="display: flex; justify-content: space-between; padding-left: 10px; padding-right: 10px;">
                                <div> <b>Supplier:</b> </div>
                            </div>

                            <div style="text-align: center;">
                                <div style="font-size: 12pt; font-weight: bold;">
                                    ${ po.meqs_supplier.supplier.name.toUpperCase() }
                                </div>
                                <div>
                                    ${ po.meqs_supplier.supplier.address.toUpperCase() }
                                </div>
                                <div>
                                    TIN: ${ po.meqs_supplier.supplier.tin.trim() !== '' ? po.meqs_supplier.supplier.tin : 'N/A' }
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="font-size: 8pt; width: 100%;">
                                <tr>
                                    <td style="width: 50%; font-weight: bold;"> RR No.: </td>
                                    <td style="font-weight: bold;"> Date: </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="font-size: 8pt; width: 100%;">
                                <tr>
                                    <td style="width: 50%;"> <b>${refType} No.:</b> ${ refNumber } </td>
                                    <td> <b>Date:</b> ${ formatDate(refDate) } </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table style="font-size: 8pt; width: 100%;">
                                <tr>
                                    <td rowspan="3" style="width: 40%;">
                                        <div style="font-weight: bold;"> Terms of Payment: </div>
                                        <div> ${ po.meqs_supplier.payment_terms } </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        VAT INC:
                                    </td>
                                    <td>
                                        <input type="checkbox" style="transform: scale(1.5);"/>
                                    </td>
                                    <td>
                                        Non VAT: 
                                    </td>
                                    <td>
                                        <input type="checkbox" style="transform: scale(1.5);"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        VAT EXC: 
                                    </td>
                                    <td>
                                        <input type="checkbox" style="transform: scale(1.5);"/>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; white-space: pre-line;"> <b>Purpose:</b> ${ purpose } </td>
                        <td style="padding: 5px;">
                            <b>Requisitioner:</b> ${ requisitioner.firstname + ' ' + requisitioner.lastname } 
                        </td>
                    </tr>
                </table>

                <br />

                <div>
                    <i>Please furnish the following articles subject to all terms and conditions stated herein and in accordance with your
                    quotation. </i> 
                </div>  

                <table class="item-table">
                    <thead>
                        <th style="border: 1px solid black;"> NO. </th>
                        <th style="border: 1px solid black;"> DESCRIPTION </th>
                        <th style="border: 1px solid black;"> UNIT </th>
                        <th style="border: 1px solid black;"> VAT </th>
                        <th style="border: 1px solid black;"> QTY. </th>
                        <th style="border: 1px solid black; white-space: nowrap;"> UNIT PRICE </th>
                        <th style="border: 1px solid black; white-space: nowrap;"> TOTAL PRICE </th>
                    </thead>
                    <tbody>
                        ${items.map((item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td style="white-space: pre-line;">${item.canvass_item.description}</td>
                            <td align="center">${item.canvass_item.unit ? item.canvass_item.unit.name : 'N/A'}</td>
                            <td align="center">${ VAT[item.vat_type].label }</td>
                            <td align="center">${item.canvass_item.quantity}</td>
                            <td align="center">${formatToPhpCurrency(item.price)}</td>
                            <td align="center">${formatToPhpCurrency(item.price * Number(item.canvass_item.quantity))}</td>
                        </tr>
                    `).join('')}

                        <tr style="border: 1px solid black;">
                            <th colspan="5"></th>
                            <th style="text-align: center;">TOTAL:</th>
                            <td align="center"><b> ${ formatToPhpCurrency(totalPrice) } </b> </td>
                        </tr>

                    </tbody>
                </table>
                
                <div style="text-align: center; padding-top: 10px;">
                    X------------------------NOTHING FOLLOWS------------------------X
                </div>

                <br />

                <table style="font-size: 8pt;">
                    <tr>
                        <td> Classification: </td>
                        <td> <b>${ classification.name }</b> </td>
                    </tr>
                    <tr>
                        <td> Fund Source: </td>
                        <td> <b>${ fundSource.name }</b> </td>
                    </tr>
                </table>

            </div>


            <div style="padding-left: 25px; padding-right: 25px; font-size: 10pt; padding-top: 50px; min-height: 20vh;">

                <div style="display: flex; justify-content: center;">

                    ${approvers.map((item, index) => `
                        
                        <div style="padding: 10px;">
                            <table border="0" style="width: 220px; font-size: 8pt;">
                                <tr>
                                    <td> ${ item.label }: </td>
                                </tr>
                                <tr>
                                    <td> 
                                        ${ item.date_approval ? formatDate(item.date_approval, true) : '&nbsp;' } 
                                    </td>
                                </tr>
                                <tr>
                                    <th style="font-size: 9pt; text-align: center; position: relative; border-bottom: 1px solid black; padding: 10px 5px; vertical-align: bottom; white-space: nowrap;">
                                        <span style="position: relative; z-index: 1; margin-bottom: 10px;">
                                            ${
                                                // @ts-ignore
                                                // item.approver.firstname + ' ' + item.approver.lastname
                                                getFullnameWithTitles(item.approver.firstname, item.approver.lastname, item.approver.middlename, item.approver.name_prefix, item.approver.name_suffix)
                                            }
                                        </span>
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
                                            item.approver.position
                                        }
                                    </td>
                                </tr>
                                ${
                                    // @ts-ignore
                                    item.approver.is_budget_officer ? `<tr style="font-size: 8pt;"> <td> Classification: ${ classification.name }  </td> </tr>` : '<tr><td></td></tr>'
                                }
                                ${
                                    // @ts-ignore
                                    item.approver.is_finance_manager ? `<tr style="font-size: 8pt;"> <td> Fund Available: ${ fundSource.name }  </td> </tr>` : '<tr><td></td></tr>'
                                }
                            
                            </table>
                        </div>

                    `).join('')}
            
                </div>

                <br />

                <table border="1" style="border-collapse: collapse; border-color: black; width: 100%; font-size: 8pt;">
                    <tr>
                        <td style="padding: 5px;"> <b> DELIVERY DATE:</b> </td>
                        <td style="padding: 5px;"> <b> SHIPPING INSTRUCTION </b> </td>
                    </tr>
                    <tr>
                    <td style="text-align: center; padding: 10px; width: 50%">
                            <div>
                                ORDER ISSUED AND AUTHORIZED:
                            </div>
                            <div style="text-align: right; margin-right: 20px;">
                                ${ formatDate(generalManager.date_approval, true) }
                            </div>
                            <br />
                            <div style="text-align: center; position: relative; font-size: 10pt; padding-top: 20px; white-space: nowrap;">
                                <u style="position: relative; z-index: 1; margin-bottom: 10px;"> 
                                    <b>
                                    ${
                                        // @ts-ignore
                                        getFullnameWithTitles(generalManager.approver.firstname, generalManager.approver.lastname, generalManager.approver.middlename, generalManager.approver.name_prefix, generalManager.approver.name_suffix)
                                    }
                                    </b>
                                </u>
                                <img class="responsive-signature" src="${
                                    // @ts-ignore
                                    this.getUploadsPath(generalManager.approver.signature_src)
                                }" />
                            </div>
                            <div>
                                        ${
                                            // @ts-ignore 
                                            generalManager.approver.position
                                        }
                            </div>
                    </td> 
                    <td style="text-align: center; padding: 10px; width: 50%">
                            <div>
                                ORDER ISSUED AND AUTHORIZED:
                            </div>
                            <div style="text-align: center; font-size: 10pt; white-space: nowrap;">
                                <b> ${ po.meqs_supplier.supplier.name } </b>
                            </div>
                            <br />
                            <div style="font-size: 10pt; padding-top: 20px;">
                                <b>____________________________________ </b>
                            </div>
                            <div>
                                Manager/Representative
                            </div>
                    </td> 
                    </tr>
                </table>

                <div style="font-size: 7pt; margin-top: 5px;"> 
                    RC No.: ${rc_number} &nbsp;&nbsp;&nbsp;&nbsp; 
                    MEQS No.: ${ po.meqs_supplier.meqs.meqs_number } 
                </div>
                
            </div>
        
        </div>
          
        `;

        await page.setContent(content);

        const pdfArrayBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: ``,
            footerTemplate: `
            <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
                padding: 5px 5px 0; color: #bbb; position: relative;">
                <div style="position: absolute; left: 5px; top: 5px;">
                    Note: System generated report | Created by: <b>${ po.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
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
            username: this.authUser.user.username,
            table: DB_TABLE.PO,
            action: 'PRINT-PO',
            reference_id: po.po_number,
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
                    is_budget_officer
                    is_finance_manager
                    signature_src
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

    private async getClassification(classificationId: string, authUser: AuthUser) {


        const query = `
            query {
                classification(id: "${ classificationId }") {
                    id 
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

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.classification;

        } catch (error) {
            return undefined;
        }
    }

    private async getFundSource(fundSourceId: string, authUser: AuthUser) {


        const query = `
            query {
                account(id: "${ fundSourceId }") {
                    id 
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

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.account;

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

    async findPo(id: string) {
        const item = await this.prisma.pO.findUnique({
            include: {
                meqs_supplier: {
                    include: {
                        meqs: {
                            include: {
                                rv: {
                                    include: {
                                        canvass: true
                                    }
                                },
                                spr: {
                                    include: {
                                        canvass: true
                                    }
                                },
                                jo: {
                                    include: {
                                        canvass: true
                                    }
                                }
                            }
                        },
                        supplier: true,
                        meqs_supplier_items: {
                            include: {
                                canvass_item: {
                                    include: {
                                        unit: true,
                                        item: true
                                    }
                                }
                            }
                        }
                    }
                },
                po_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('PO not found')
        }

        return item
    }

    getAwardedItems(meqsSupplierItems: MeqsSupplierItem[], supplier: Supplier): MeqsSupplierItem[] {

        return meqsSupplierItems.filter(i => !!i.is_awarded)

    }

}
