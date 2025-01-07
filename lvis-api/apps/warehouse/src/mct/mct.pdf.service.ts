
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles, formatToPhpCurrency } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MCT as M } from 'apps/warehouse/prisma/generated/client';
import { MCT } from './entities/mct.entity';

@Injectable()
export class MctPdfService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generatePdf(mct: MCT) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(mct.mct_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        const requisitioner = await this.getEmployee(mct.mrv.requested_by_id, this.authUser)

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

            <div style="flex-grow: 1;">
        
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
                        
                    </div>
                </div>

                <br />

                <div style="display: flex; justify-content: space-between;">

                    <div>
                        <table style="font-size: 8pt; width: 200px;">
                            <tr>
                                <td style="width: 50%">MCT No.:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center">
                                    ${ mct.mct_number } 
                                </td>
                            </tr>     
                            <tr>
                                <td>MRV No.:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${ mct.mrv.mrv_number } </td>
                            </tr>
                        </table>
                    </div>

                    <div>
                        <table style="font-size: 8pt; width: 200px;">
                            <tr>
                                <td> Date: </td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center">
                                ${formatDate(mct.mct_date)}
                                </td>
                            </tr>   
                            ${ mct.mrv.or_number ? `
                            <tr>
                                <td>OR No.</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${ mct.mrv.or_number } </td>
                            </tr>
                            ` : ''}
                            ${ mct.mrv.mwo_number ? `
                                <tr>
                                    <td>MWO No.</td>
                                    <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${ mct.mrv.mwo_number } </td>
                                </tr>
                                ` : ''}
                            ${ mct.mrv.cwo_number ? `
                            <tr>
                                <td>CWO No.</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${ mct.mrv.cwo_number } </td>
                            </tr>
                            ` : ''}
                            ${ mct.mrv.jo_number ? `
                                <tr>
                                    <td>JO No.</td>
                                    <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${ mct.mrv.jo_number } </td>
                                </tr>
                                ` : ''}
                        </table>
                    </div>
                
                </div>

                <br />
                <div class="heading" style="text-align: center;">MATERIAL CHARGE TICKET</div>
                <br />
                <br />

                <table style="width: 100%; font-size: 9pt; border-collapse: collapse; ">
                    <tbody>
                        <tr>
                            <td style="width: 20%">Consumer Name</td>
                            <td style="text-align: right">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line;"> ${ mct.mrv.consumer_name } </td>
                        </tr>
                        <tr>
                            <td style="width: 20%">Requested By: </td>
                            <td style="text-align: right">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold;"> ${ getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix) } </td>
                        </tr>
                        <tr>
                            <td style="width: 20%">Item From</td>
                            <td style="text-align: right;">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold;"> ${ mct.mrv.item_from.name } </td>
                        </tr>
                        <tr>
                            <td style="width: 20%">Purpose</td>
                            <td style="text-align: right">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line;"> ${ mct.mrv.purpose }</td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />

                <table style="width: 100%; font-size: 8pt; border: 1px solid black; border-collapse: collapse;">
                    <thead>
                        <th style="border: 1px solid black;"> No. </th>
                        <th style="border: 1px solid black;"> Item Code </th>
                        <th style="border: 1px solid black;"> Description </th>
                        <th style="border: 1px solid black;"> Quantity </th>
                        <th style="border: 1px solid black;"> Unit </th>
                        <th style="border: 1px solid black;"> Unit Cost </th>
                    </thead>
                    <tbody>
                        ${mct.mrv.mrv_items.map((mrv_item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td>${mrv_item.item.code}</td>
                            <td style="white-space: pre-line;" align="center">${mrv_item.item.description} ${ mrv_item.item.project_item ? `(${ mrv_item.item.project_item.project.name })` : '' }</td>
                            <td align="center">${mrv_item.quantity}</td>
                            <td align="center">${mrv_item.item.unit.name}</td>
                            <td align="center">${formatToPhpCurrency(mrv_item.price)}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" style="font-weight: bold">Total no. of records: ${ mct.mrv.mrv_items.length }</td>
                        </tr>
                    </tfoot>
                </table>
                
                <br />
        
            </div>
        
            <div padding-top: 20px;">

                    ${approvers.map((item, index) => `
                    
                        <div style="padding: 10px; width: 40%">
                            <table border="0" style="width: 100%; font-size: 8pt;">
                                <tr>
                                    <td> ${ item.label } </td>
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
                                        <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
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
                    Note: System generated report | Created by: <b>${ mct.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
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

        return pdfBuffer;
    }

    async generateGatePassPdf(mct: MCT) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const [requisitioner, isd_manager, warehouse_custodian] = await Promise.all([
            this.getEmployee(mct.mrv.requested_by_id, this.authUser),
            this.get_ISD_Manager(this.authUser),
            this.get_warehouse_custodian(this.authUser)
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

            <div style="flex-grow: 1;">
        
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
                        
                    </div>
                </div>

                <br />


                <div style="display: flex; justify-content: flex-end;">
                    <div>
                        <table style="font-size: 8pt; width: 200px;">
                            <tr>
                                <td style="width: 30%">Date:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center">
                                    ${ formatDate(new Date()) }
                                </td>
                            </tr>     
                        </table>
                    </div>
                </div>


                <br />
                <div class="heading" style="text-align: center;">GATE PASS</div>
                <br />
                <br />

                <table border="0" style="width: 100%; font-size: 9pt; border-collapse: collapse; ">
                    <tbody>
                        <tr>
                            <td style="width: 15%; font-weight: bold; padding-bottom: 8px;">ATTENTION:</td>
                            <td style="font-weight: bold; padding-bottom: 8px;">
                                SECURITY GUARD ON DUTY
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding-bottom: 8px;">
                                Please allow <u><b> ${ getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix) } </b> </u> of <u><b> ${ requisitioner.department.code } - ${ requisitioner.department.name }</b> </u> to leave / pass, after thorough inspection of cargoes / items; office supplies; electrical; materials; equipment; general set and / or spare parts and hardware, issued by the WAREHOUSE as listed here under.
                            </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">PURPOSE:</td>
                            <td style="padding-bottom: 8px; white-space: pre-line;">${mct.mrv.purpose }</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">LOCATION:</td>
                            <td style="padding-bottom: 8px; white-space: pre-line;">${mct.mrv.location }</td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />

                <table style="width: 100%; font-size: 8pt; border: 1px solid black; border-collapse: collapse;">
                    <thead>
                        <th style="border: 1px solid black;"> No. </th>
                        <th style="border: 1px solid black;"> Item Code </th>
                        <th style="border: 1px solid black;"> Description </th>
                        <th style="border: 1px solid black;"> Quantity </th>
                        <th style="border: 1px solid black;"> Unit </th>
                        <th style="border: 1px solid black;"> Unit Cost </th>
                    </thead>
                    <tbody>
                        ${mct.mrv.mrv_items.map((mrv_item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td>${mrv_item.item.code}</td>
                            <td style="white-space: pre-line;" align="center">${mrv_item.item.description} ${ mrv_item.item.project_item ? `(${ mrv_item.item.project_item.project.name })` : '' }</td>
                            <td align="center">${mrv_item.quantity}</td>
                            <td align="center">${mrv_item.item.unit.name}</td>
                            <td align="center">${formatToPhpCurrency(mrv_item.price)}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" style="font-weight: bold">Total no. of records: ${ mct.mrv.mrv_items.length }</td>
                        </tr>
                    </tfoot>
                </table>
                
                <br />
        
            </div>
        
            <div style="padding-top: 20px;">

                <div style="padding: 10px; width: 40%">
                    <table border="0" style="width: 100%; font-size: 8pt;">
                        <tr>
                            <td> Issued By </td>
                        </tr>
                        <tr>
                            <th style="text-align: center; position: relative; font-size: 10pt;">
                                <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                    ${
                                        // @ts-ignore
                                        getFullnameWithTitles(warehouse_custodian.firstname, warehouse_custodian.lastname, warehouse_custodian.middlename, warehouse_custodian.name_prefix, warehouse_custodian.name_suffix)
                                    }
                                </u>
                                <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                    // @ts-ignore
                                    this.getUploadsPath(warehouse_custodian.signature_src)
                                }" />
                            </th>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                ${
                                    // @ts-ignore
                                    warehouse_custodian.position ? warehouse_custodian.position : ''
                                }
                            </td>
                        </tr>
                    </table>
                </div>

                
                <div style="padding-top: 50px;">
                
                    <table border="0" style="width: 100%; font-size: 8pt; border-collapse: collapse;">
                        <tr>
                            <td style="width: 45%; padding: 10px; vertical-align: top;">Inspected By:</td>
                            <td style="width: 10%"></td>
                            <td style="width: 45%; padding: 10px; vertical-align: top;">Noted By:</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px: 10px; border-bottom: 1px solid black; text-align: center;">
                            
                            </td>
                            <td></td>
                            <td style="padding-top: 10px; border-bottom: 1px solid black; text-align: center; font-weight: bold; font-size: 10pt; position: relative; z-index: 1; ">
                            ${
                                // @ts-ignore
                                getFullnameWithTitles(isd_manager.firstname, isd_manager.lastname, isd_manager.middlename, isd_manager.name_prefix, isd_manager.name_suffix)
                            }
                            <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                // @ts-ignore
                                this.getUploadsPath(isd_manager.signature_src)
                            }" />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">
                                <div>
                                    SECURITY GUARD ON DUTY
                                </div>
                                <div style="font-size: 7pt;">
                                    <i>Signature Over Printed Name</i>
                                </div>
                            </td>
                            <td></td>
                            <td style="text-align: center;">ISD Manager</td>
                        </tr>
                    </table>

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
                    Note: System generated report | Created by: <b>${ mct.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
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

    private async get_warehouse_custodian(authUser: AuthUser) {


        const query = `
            query {
                warehouse_custodian {
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

            return data.data.warehouse_custodian;

        } catch (error) {
            throw error;
        }
    }

    private async get_ISD_Manager(authUser: AuthUser) {


        const query = `
            query {
                isd_manager {
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

            return data.data.isd_manager;

        } catch (error) {
            throw error;
        }
    }

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    async findMct(id: string): Promise<M> {
        const item = await this.prisma.mCT.findUnique({
            select: {
                mct_number: true,
                mct_date: true,
                created_by: true,
                approval_status: true,
                mrv: {
                    select: {
                        requested_by_id: true,
                        consumer_name: true,
                        or_number: true,
                        mwo_number: true,
                        cwo_number: true,
                        jo_number: true,
                        item_from: true,
                        location: true,
                        purpose: true,
                        mrv_number: true,
                        mrv_items: {
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
                            }
                        }
                    }
                },
                mct_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('MCT not found')
        }

        // @ts-ignore
        return item
    }

}
