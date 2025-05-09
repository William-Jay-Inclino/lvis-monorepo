// pdf.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getFullnameWithTitles, getImageAsBase64 } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { JO } from './entities/jo.entity';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class JoPdfService {

    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'


    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly audit: WarehouseAuditService,
    ) { }
    async generatePdf(
        jo: JO, 
        metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ) {

        const authUser = metadata.authUser

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(jo.jo_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, authUser);
            return i;
        }));

        const [classification, department, division, requisitioner] = await Promise.all([
            this.getClassification(jo.classification_id, authUser),
            this.getDepartment(jo.department_id, authUser),
            this.getDivision(jo.division_id, authUser),
            this.getEmployee(jo.canvass.requested_by_id, authUser),
        ]);
        
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
                top: -40px;
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
                        <div class="heading">JOB ORDER REQUEST</div>
                    </div>
                </div>

                <br />

                <div style="display: flex; justify-content: space-between;">

                    <div style="width: 50%;">
                        <table style="font-size: 8pt; width: 100%;">
                            <tr>
                                <td style="white-space: pre-line;"><b>Purpose:</b> ${jo.canvass.purpose}</td>
                            </tr>     
                            <tr>
                                <td style="font-weight: bold;">Listed below are the list of Item/s needed:</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin-left: auto; text-align: right;">
                        <table style="font-size: 8pt">
                            <tr>
                                <td style="font-weight: bold;"> JO No.: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${jo.jo_number}
                                </td>
                            </tr>    
                            <tr>
                                <td style="font-weight: bold;">Date: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${formatDate(jo.date_requested)}
                                </td>
                            </tr>
                        </table>
                    </div>
                
                </div>

                <br />

                <table class="item-table">
                    <thead>
                        <th style="border: 1px solid black;"> NO. </th>
                        <th style="border: 1px solid black;"> DESCRIPTION AND SPECIFICATIONS </th>
                        <th style="border: 1px solid black;"> UNIT </th>
                        <th style="border: 1px solid black;"> QTY. </th>
                    </thead>
                    <tbody>
                        ${jo.canvass.canvass_items.map((item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td style="white-space: pre-line;">${item.description}</td>
                            <td align="center">${item.unit ? item.unit.name : 'N/A'}</td>
                            <td align="center">${item.quantity}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>

                <div style="text-align: center; padding-top: 10px;">
                    X------------------------NOTHING FOLLOWS------------------------X
                </div>

                <br />

                <table style="font-size: 8pt;">
                    <tr>
                        <td> Department: </td>
                        <td> <b>${ department.name }</b> </td>
                    </tr>
                    <tr>
                        <td> Division: </td>
                        <td> <b>${ !!division ? division.name : 'N/A' }</b> </td>
                    </tr>
                </table>
        
            </div>
        
            <div style="padding-left: 25px; padding-right: 25px; font-size: 8pt; padding-top: 50px; min-height: 32vh; display: flex; justify-content: center;">

                <div style="display: flex; flex-wrap: wrap; page-break-inside: avoid;">

                    <div style="padding: 10px; width: 45%">
                        <table border="0" style="width: 100%; font-size: 8pt; page-break-inside: avoid; position: relative;">
                            <tr>
                                <td> Requested By: </td>
                            </tr>
                            <tr>
                                <td> ${formatDate(jo.date_requested, true)} </td>
                            </tr>
                            <tr>
                                <th style="text-align: center; position: relative; font-size: 9pt; white-space: nowrap;">
                                    <u style="position: relative; z-index: 1; margin-bottom: 10px;">${ requisitioner.firstname + ' ' + requisitioner.lastname }</u>

                                    <img class="responsive-signature" src="${ this.getUploadsPath(requisitioner.signature_src) }" />
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                ${
                                    // @ts-ignore
                                    requisitioner.position
                                } 
                                </td>
                            </tr>
                        </table>
                    </div>

                    ${approvers.map((item, index) => `
                    
                        <div style="padding: 10px; width: 45%">
                            <table border="0" style="width: 100%; font-size: 8pt; page-break-inside: avoid; position: relative;">
                                <tr>
                                    <td> ${ item.label } </td>
                                </tr>
                                <tr>
                                    <td> ${formatDate(item.date_approval, true)} </td>
                                </tr>
                                <tr>
                                    <th style="text-align: center; position: relative; font-size: 9pt; white-space: nowrap;">
                                        <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                            ${
                                                // @ts-ignore
                                                // item.approver.firstname + ' ' + item.approver.lastname
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
                                            item.approver.position
                                        }
                                    </td>
                                </tr>
                                ${
                                    // @ts-ignore 
                                    item.approver.is_budget_officer ? `<tr> <td> Classification: ${ classification.name } </td> </tr>` : '<tr> <td></td> </tr>'
                                }
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
                    Note: System generated report | Created by: <b>${ jo.created_by }</b> | Printed by: <b>${authUser.user.username}</b> | 
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
            table: DB_TABLE.JO,
            action: 'PRINT-JO',
            reference_id: jo.jo_number,
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
                    is_budget_officer
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

    private async getDepartment(departmentId: string, authUser: AuthUser) {

        const query = `
            query {
                department(id: "${ departmentId }") {
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

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.department;

        } catch (error) {
            return undefined;
        }
    }

    private async getDivision(divisionId: string, authUser: AuthUser) {

        const query = `
            query {
                division(id: "${ divisionId }") {
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

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.division;

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

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    async findJo(id: string) {
        const item = await this.prisma.jO.findUnique({
            include: {
                canvass: {
                    include: {
                        canvass_items: {
                            include: {
                                unit: true,
                            }
                        }
                    }
                },
                jo_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('SPR not found')
        }

        return item
    }

}
