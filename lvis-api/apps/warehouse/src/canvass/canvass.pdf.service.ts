// pdf.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getFullnameWithTitles, getImageAsBase64 } from '../__common__/helpers';
import { Canvass } from './entities/canvass.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Employee } from '../__employee__/entities/employee.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class CanvassPdfService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }

    async generatePdf(
        canvass: Canvass, 
        metadata: { 
            ip_address: string, 
            device_info: any,
            authUser: AuthUser,
        }
    ) {
        
        const authUser = metadata.authUser

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const [requisitioner, notedBy] = await Promise.all([
            this.getEmployee(canvass.requested_by_id, authUser),
            this.getGM(authUser)
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

        </style>

        
        <div class="watermark"></div>

        <div class="content">

            <div style="flex-grow: 1; min-height: 55vh;">
        
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
                        <br />
                        <div class="heading">OFFICIAL CANVASS SHEET</div>
                    </div>
                </div>

                <br />


                <div style="display: flex; justify-content: space-between;">

                    <div style="width: 50%;">
                        <table style="font-size: 8pt; width: 100%;">
                            <tr>
                                <td style="white-space: pre-line;"><b>Purpose:</b> ${canvass.purpose}</td>
                            </tr>     
                            <tr>
                                <td style="white-space: pre-line;"><b>Requisitioner Notes:</b> ${canvass.notes} </td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin-left: auto; text-align: right;">
                        <table style="font-size: 8pt;">
                            <tr>
                                <td style="font-weight: bold;"> RC No.: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${canvass.rc_number}
                                </td>
                            </tr>     
                            <tr>
                                <td style="font-weight: bold;">Date: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${formatDate(canvass.date_requested)}
                                </td>
                            </tr>
                        </table>
                    </div>

                </div>


                <br />
        
                <table style="width: 100%; border-collapse: collapse; font-size: 8pt;">
                    <thead>
                        <th style="border: 1px solid black;"> NO. </th>
                        <th style="border: 1px solid black;"> ITEM DESCRIPTION AND SPECIFICATIONS </th>
                        <th style="border: 1px solid black;"> UNIT </th>
                        <th style="border: 1px solid black;"> QTY. </th>
                        <th style="border: 1px solid black;"> UNIT COST </th>
                    </thead>
                    <tbody>
                        ${canvass.canvass_items.map((item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center" style="padding: 8px 4px;">${index + 1}</td>
                            <td style="white-space: pre-line; padding: 8px 4px;">${item.description}</td>
                            <td align="center" style="padding: 8px 4px;">${item.unit ? item.unit.name : 'N/A'}</td>
                            <td align="center" style="padding: 8px 4px;">${item.quantity}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>

                <div style="text-align: center; padding-top: 10px;">
                    X------------------------NOTHING FOLLOWS------------------------X
                </div>
        
            </div>
        
            <div style="padding-left: 25px; padding-right: 25px; font-size: 9pt; padding-top: 50px; min-height: 32vh;">

                <div style="display: flex; justify-content: space-between;">
                
                    <div>
                        Terms of Payment:
                    </div>

                    <div>
                        <span>
                            None VAT: <input type="checkbox" style="transform: scale(2);"/>
                        </span>
                        <span style="margin-left: 25px;">
                            VAT Inclusive: <input type="checkbox" style="transform: scale(2);"/>
                        </span>
                        <span style="margin-left: 25px;">
                            VAT Exclusive: <input type="checkbox" style="transform: scale(2);"/>
                        </span>
                    </div>

                </div>

                <hr />

                <br />

                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1;">
                        <table style="font-size: 8pt; width: 90%">
                            <tr>
                                <td width="30%">Prepared By:</td>
                            </tr>
                            <tr>
                                <td style="text-align: center; border-bottom: 1px solid black; font-size: 10pt; white-space: nowrap;">
                                    <div style="margin-top: 20px; ">
                                        <b> 
                                            ${
                                                // @ts-ignore
                                                // requisitioner.firstname + ' ' + requisitioner.lastname
                                                getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix)
                                            } 
                                        </b>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <div>
                                        ${
                                            // @ts-ignore
                                            requisitioner.position ? requisitioner.position : ''
                                        } 
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div style="flex: 1;">
                        <table style="font-size: 8pt; width: 90%">
                            <tr>
                                <td width="30%">Noted By:</td>
                            </tr>
                            <tr>
                                <td style="text-align: center; border-bottom: 1px solid black; font-size: 10pt; white-space: nowrap;">
                                    <div style="margin-top: 20px; ">
                                        <b> 
                                            ${
                                                // @ts-ignore
                                                // notedBy.firstname + ' ' + notedBy.lastname
                                                getFullnameWithTitles(notedBy.firstname, notedBy.lastname, notedBy.middlename, notedBy.name_prefix, notedBy.name_suffix)
                                            } 
                                        </b>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <div>
                                    ${
                                        // @ts-ignore
                                        notedBy.position ? notedBy.position : ''
                                    } 
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <br />
                <br />

                <div style="text-align: center;">
                    <table border="0" style="width: 75%; margin: 0 auto; font-size: 10pt; border-spacing: 0 10px;">
                        <tr>
                            <td style="width: 20%;">
                                <div style="display: flex; justify-content: space-between; ">
                                    <span>Supplier</span>
                                    <span>:</span>
                                </div>
                            </td>
                            <td style="border-bottom: 1px solid black;"></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; justify-content: space-between; ">
                                    <span>TIN No.</span>
                                    <span>:</span>
                                </div>
                            </td>
                            <td style="border-bottom: 1px solid black"></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; justify-content: space-between; ">
                                    <span>Address</span>
                                    <span>:</span>
                                </div>
                            </td>
                            <td style="border-bottom: 1px solid black; margin-bottom: 10px;"></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; justify-content: space-between; ">
                                    <span>Telephone</span>
                                    <span>:</span>
                                </div>
                            </td>
                            <td style="border-bottom: 1px solid black"></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; justify-content: space-between; ">
                                    <span>Signature Over Printed Name</span>
                                    <span>
                                        <br />
                                        :
                                    </span>
                                </div>
                            </td>
                            <td style="border-bottom: 1px solid black"></td>
                        </tr>
                    </table>
                </div>

            </div>

        
        </div>

        `;

        await page.setContent(content);
        
        // const pdfArrayBuffer = await page.pdf({
        //     printBackground: true,
        //     format: 'A4',
        //     displayHeaderFooter: true,
        //     headerTemplate: `<div style="width: 100%; font-size: 0;"></div>`,
        //     footerTemplate: `
        //     <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
        //         padding: 5px 5px 0; color: #bbb; position: relative;">
        //         <div style="position: absolute; left: 5px; top: 5px;">
        //             Note: System generated report | Created by: <b>${ canvass.created_by }</b> | Printed by: <b>${authUser.user.username}</b> | 
        //             Date & Time: <b><span class="date"></span></b>
        //         </div>
        //         <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
        //     </div>
        //   `,
        //     // this is needed to prevent content from being placed over the footer
        //     margin: { bottom: '70px', top: '60px' },
        //   });

        const pdfArrayBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: `<div style="width: 100%; font-size: 0;"></div>`,
            footerTemplate: `
            <div style="border-top: solid 1px #eaeaea; width: 100%; font-size: 9px;
                padding: 12px 5px 0; color: #555; position: relative; font-family: Arial, sans-serif;">
                
                <!-- Email Section - With added margin-bottom -->
                <div style="background: #f5f9ff; border-left: 4px solid #4a90e2; 
                    padding: 8px 12px; margin: 0 auto 25px; max-width: 90%;">
                    <div style="font-size: 10px; line-height: 1.4; text-align: center;">
                        For those who will opted to send their quotations via email, kindly send to this email address <span style="font-weight: 600;">leyeco5_bac@leyeco-v.com.ph</span> cc <span style="font-weight: 600;">audit@leyeco-v.com.ph</span> only. Those sent to other email address will not be acknowledged
                    </div>
                </div>
            
                <!-- Lower Details Section - Position adjusted downward -->
                <div style="position: absolute; left: 5px; top: 85px; font-size: 8px; color: #666;">
                    Note: System generated report | Created by: <b>${canvass.created_by}</b> | 
                    Printed by: <b>${authUser.user.username}</b> | 
                    Date & Time: <b><span class="date"></span></b>
                </div>
                <div style="position: absolute; right: 5px; top: 85px; font-size: 8px; color: #666;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            </div>
            `,
            margin: { bottom: '180px', top: '60px' },
        });

        
        // Convert Uint8Array (ArrayBuffer) to Buffer
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

        await browser.close();

        // create audit
        await this.audit.createAuditEntry({
            username: authUser.user.username,
            table: DB_TABLE.CANVASS,
            action: 'PRINT-CANVASS',
            reference_id: canvass.rc_number,
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }
    
    async findCanvass(id: string) {

        const item = await this.prisma.canvass.findUnique({
            include: {
                canvass_items: {
                    include: {
                        unit: true,
                        item: true
                    }
                },
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('Canvass not found')
        }

        return item

    }


    private async getEmployee(employeeId: string, authUser: AuthUser): Promise<Employee | undefined> {


        const query = `
            query {
                employee(id: "${ employeeId }") {
                    id 
                    firstname 
                    middlename 
                    lastname
                    position
                    name_prefix
                    name_suffix
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
            throw new Error(`Error getting employee: ${error}`)
        }
    }

    private async getGM(authUser: AuthUser): Promise<Employee | undefined> {


        const query = `
            query {
                general_manager {
                    id 
                    firstname 
                    middlename 
                    lastname
                    position
                    name_prefix
                    name_suffix
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

            return data.data.general_manager;

        } catch (error) {
            throw new Error(`Error getting general_manager: ${ error }`)
        }
    }

}
