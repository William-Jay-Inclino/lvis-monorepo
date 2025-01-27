// pdf.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, formatToPhpCurrency, getFullnameWithTitles, getImageAsBase64 } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { MEQS } from './entities/meq.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { CanvassItem } from '../canvass-item/entities/canvass-item.entity';
import { UPLOADS_PATH } from '../__common__/config';
import { MeqsSupplier } from '../meqs-supplier/entities/meqs-supplier.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class MeqsPdfService {

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

    async generatePdf(meqs: MEQS, metadata: { ip_address: string, device_info: any }) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        let purpose, refNumber, refType, requisitioner_notes, requested_by_id, canvassItems: CanvassItem[]

        if(meqs.rv) {
            purpose = meqs.rv.canvass.purpose
            requisitioner_notes = meqs.rv.canvass.notes
            requested_by_id = meqs.rv.canvass.requested_by_id
            refNumber = meqs.rv.rv_number
            refType = 'RV'
            canvassItems = meqs.rv.canvass.canvass_items
        } else if(meqs.spr) {
            requisitioner_notes = meqs.spr.canvass.notes
            purpose = meqs.spr.canvass.purpose
            requested_by_id = meqs.spr.canvass.requested_by_id
            refNumber = meqs.spr.spr_number
            refType = 'SPR'
            canvassItems = meqs.spr.canvass.canvass_items
        } else {
            requisitioner_notes = meqs.jo.canvass.notes
            purpose = meqs.jo.canvass.purpose
            requested_by_id = meqs.jo.canvass.requested_by_id
            refNumber = meqs.jo.jo_number
            refType = 'JO'
            canvassItems = meqs.jo.canvass.canvass_items
        }

        const approvers = await Promise.all(meqs.meqs_approvers.map(async (i) => {
            // @ts-ignore
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        const [requisitioner, awardedSuppliers] = await Promise.all([
            this.getEmployee(requested_by_id, this.authUser),
            this.getAwardedSuppliers(meqs.meqs_suppliers, canvassItems)
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
                top: 63%;
                left: 58%;
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

            <div style="flex-grow: 1; min-height: 72vh;">
        
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
                        <div class="heading">MATERIALS / EQUIPMENT QUOTATION SUMMARY</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 20px;">

                    <div style="width: 50%;">
                        <table border="0" style="font-size: 8pt; width: 100%;">
                            <tr>
                                <td style="white-space: pre-line;"><b>Purpose:</b> ${ purpose } </td>
                            </tr>  
                            <tr>
                                <td style="white-space: pre-line;"><b>Requisitioner Notes:</b> ${ requisitioner_notes }</td>
                            </tr> 
                        </table>
                    </div>

                    <div style="margin-left: auto; text-align: right;">
                        <table style="font-size: 8pt">
                            <tr>
                                <td style="font-weight: bold;"> MEQS No.: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${meqs.meqs_number}
                                </td>
                            </tr>   
                            <tr>
                                <td style="font-weight: bold;">Date Prepared: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${formatDate(meqs.meqs_date)}
                                </td>
                            </tr>
                        </table>
                    </div>
                
                </div>

                <br />

                <table class="item-table">
                    <caption style="text-align: left;"> <i>Note: The price with star in the 'Supplier' column indicates the awarded supplier </i></caption>
                    <thead>
                        <th style="border: 1px solid black;"> MATERIALS / EQUIPMENT DESCRIPTION </th>
                        <th style="border: 1px solid black;"> UNIT </th>
                        <th style="border: 1px solid black;"> QTY. </th>

                        ${meqs.meqs_suppliers.map((item, index) => `
                        <th align="center" style="border: 1px solid black; width: 10%;">
                            ${ item.supplier.name.toUpperCase() }
                        </th>
                        `).join('')}

                    </thead>

                    <tbody>
                        ${canvassItems.map((canvassItem, index) => {

                            const tdElements = meqs.meqs_suppliers.map(supplier => {
                                for (let supplierItem of supplier.meqs_supplier_items) {
                                    if (supplierItem.canvass_item_id === canvassItem.id) {

                                        if(supplierItem.is_awarded) {
                                            return `<td align="center"><b>${(supplierItem.price !== -1) ? formatToPhpCurrency(supplierItem.price) : 'N/A'} &#9733;</b></td>`;
                                        }else {
                                            return `<td align="center">${(supplierItem.price !== -1) ? formatToPhpCurrency(supplierItem.price) : 'N/A'}</td>`;
                                        }

                                    }
                                }
                                return `<td align="center"></td>`; // Default empty <td> if no match found
                            }).join('');
                    
                            return `
                            <tr style="border: 1px solid black;">
                                <td style="white-space: pre-line;">${index + 1}. ${canvassItem.description}</td>
                                <td align="center">${canvassItem.unit ? canvassItem.unit.name : 'N/A'}</td>
                                <td align="center">${canvassItem.quantity}</td>
                                ${tdElements}
                            </tr>`;
                        }).join('')}

                    </tbody>
                
                </table>

                <div style="text-align: center; padding-top: 10px;">
                    X------------------------NOTHING FOLLOWS------------------------X
                </div>

                <br />

                <table style="font-size: 8pt;">
                    <tr>
                        <td style="white-space: pre-line;">${ meqs.notes }</td>
                    </tr>
                    <tr>
                        <td>
                            ${awardedSuppliers.length > 1 ? 'Awarded Suppliers:' : 'Awarded Supplier:'}
                            <ul>
                                ${awardedSuppliers.map(i => {
                                    return `<li> <b>${ i.supplier.name }</b> </li>`
                                }).join('')}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap;">
                            Requisitioner: 
                            <b>
                            ${
                                // @ts-ignore
                                // requisitioner.firstname + ' ' + requisitioner.lastname
                                getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix)

                            } 
                            </b> 
                        </td>
                    </tr>
                </table>
        
            </div>
        
            <div style="padding-left: 25px; padding-right: 25px; font-size: 9pt; padding-top: 50px; min-height: 18vh;">
                
                <div style="text-align: center; margin-bottom: 10px;"> <b>COOP PROCUREMENT COMMITTEE: </b></div>

                <br />

                <div style="display: flex; justify-content: center;">
                
                    ${approvers.map((item, index) => `
                        
                        <div style="padding: 10px; margin-right: 5px;">
                            <table border="0" style="width: 100%; font-size: 8pt;">
                                <tr>
                                    <td style="font-size: 8pt;"> 
                                        ${ item.date_approval ? formatDate(item.date_approval, true) : '&nbsp;' } 
                                    </td>
                                </tr>
                                <tr>
                                    <th style="font-size: 9pt; text-align: center; position: relative; border-bottom: 1px solid black; white-space: nowrap;">
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
                                        ${ item.label }
                                    </td>
                                </tr>
                            </table>
                        </div>

                    `).join('')}

                </div>
                
                <div style="font-size: 7pt; margin-top: 10px;"> 
                    ${ refType } No.: ${ refNumber } 
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
                    Note: System generated report | Created by: <b>${ meqs.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
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
            table: DB_TABLE.MEQS,
            action: 'PRINT-MEQS',
            reference_id: meqs.meqs_number,
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }

    private getAwardedSuppliers(meqs_suppliers: MeqsSupplier[], canvass_items: CanvassItem[]): MeqsSupplier[] {
        const awardedMeqsSupplier: MeqsSupplier[] = [];
        const supplierIds = new Set<string>(); // Track unique supplier IDs
    
        for (const canvassItem of canvass_items) {
            for (const meqsSupplier of meqs_suppliers) {
                for (const meqsSupplierItem of meqsSupplier.meqs_supplier_items) {
                    if (
                        meqsSupplierItem.canvass_item_id === canvassItem.id &&
                        meqsSupplierItem.is_awarded &&
                        !supplierIds.has(meqsSupplier.id) // Check for uniqueness
                    ) {
                        awardedMeqsSupplier.push(meqsSupplier);
                        supplierIds.add(meqsSupplier.id); // Add supplier ID to the set
                    }
                }
            }
        }
    
        return awardedMeqsSupplier;
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

    async findMeqs(id: string) {
        const item = await this.prisma.mEQS.findUnique({
            include: {
                rv: {
                    include: {
                        canvass: {
                            include: {
                                canvass_items: {
                                    include: {
                                        unit: true
                                    }
                                }
                            }
                        }
                    }
                },
                spr: {
                    include: {
                        canvass: {
                            include: {
                                canvass_items: {
                                    include: {
                                        unit: true
                                    }
                                }
                            }
                        }
                    }
                },
                jo: {
                    include: {
                        canvass: {
                            include: {
                                canvass_items: {
                                    include: {
                                        unit: true
                                    }
                                }
                            }
                        }
                    }
                },
                meqs_suppliers: {
                    include: {
                        supplier: true,
                        meqs_supplier_items: {
                            include: {
                                canvass_item: {
                                    include: {
                                        unit: true
                                    }
                                },
                                meqs_supplier: {
                                    include: {
                                        supplier: true
                                    }
                                }
                            }
                        }
                    }
                },
                meqs_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { 
                id,
            }
        })

        if (!item) {
            throw new NotFoundException('MEQS not found')
        }

        return item
    }

}
