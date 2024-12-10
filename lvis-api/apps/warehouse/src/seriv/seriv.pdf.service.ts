
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles, formatToPhpCurrency } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { SERIV as S } from 'apps/warehouse/prisma/generated/client';
import { SERIV } from './entities/seriv.entity';

@Injectable()
export class SerivPdfService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generateGatePassPdf(seriv: SERIV) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(seriv.seriv_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        const requisitioner = await this.getEmployee(seriv.requested_by_id, this.authUser)
        const isd_manager = await this.get_ISD_Manager(this.authUser)
        const warehouse_custodian = await this.get_warehouse_custodian(this.authUser)

        // Set content of the PDF
        const content = `


        <style>
            body {
                margin: 0;
                padding: 0;
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
            .content {
                display: flex; flex-direction: column;
                padding-left: 25px; padding-right: 25px; font-size: 10pt; 
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
                                <span style="font-size: 11pt; font-weight: bold;">LEYTE V ELECTRIC COOPERATIVE, INC.</span>
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
                        <table style="font-size: 10pt; width: 140px;">
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
                <div style="font-size: 12pt; font-weight: bold; text-align: center;">GATE PASS</div>
                <br />
                <br />

                <table border="0" style="width: 100%; font-size: 11pt; border-collapse: collapse; ">
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
                            <td style="padding-bottom: 8px;">
                                ${seriv.purpose }
                            </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">LOCATION:</td>
                            <td style="padding-bottom: 8px;">
                                ${seriv.location }
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />

                <table style="width: 100%; font-size: 10pt; border: 1px solid black; border-collapse: collapse;">
                    <thead>
                        <th style="border: 1px solid black;"> No. </th>
                        <th style="border: 1px solid black;"> Item Code </th>
                        <th style="border: 1px solid black;"> Description </th>
                        <th style="border: 1px solid black;"> Quantity </th>
                        <th style="border: 1px solid black;"> Unit </th>
                        <th style="border: 1px solid black;"> Unit Cost </th>
                    </thead>
                    <tbody>
                        ${seriv.seriv_items.map((seriv_item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td>${seriv_item.item.code}</td>
                            <td align="center">${seriv_item.item.description}</td>
                            <td align="center">${seriv_item.quantity}</td>
                            <td align="center">${seriv_item.item.unit.name}</td>
                            <td align="center">${formatToPhpCurrency(seriv_item.price)}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" style="font-weight: bold">Total no. of records: ${ seriv.seriv_items.length }</td>
                        </tr>
                    </tfoot>
                </table>
                
                <br />
        
            </div>
        
            <div style="font-size: 10pt; padding-top: 20px;">

                    
                <div style="padding: 10px; width: 40%">
                    <table border="0" style="width: 100%; font-size: 10pt;">
                        <tr>
                            <td> Issued By </td>
                        </tr>
                        <tr>
                            <th style="text-align: center; position: relative; font-size: 12pt;">
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
                
                    <table border="0" style="width: 100%; font-size: 10pt; border-collapse: collapse;">
                        <tr>
                            <td style="width: 45%; padding: 10px; vertical-align: top;">Inspected By:</td>
                            <td style="width: 10%"></td>
                            <td style="width: 45%; padding: 10px; vertical-align: top;">Noted By:</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px: 10px; border-bottom: 1px solid black; text-align: center;">
                            
                            </td>
                            <td></td>
                            <td style="padding-top: 10px; border-bottom: 1px solid black; text-align: center; font-weight: bold; font-size: 12pt; position: relative; z-index: 1; ">
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
                                <div style="font-size: 10pt;">
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

        const pdfBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: ``,
            footerTemplate: `
            <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
                padding: 5px 5px 0; color: #bbb; position: relative;">
                <div style="position: absolute; left: 5px; top: 5px;">
                    Note: System generated report | Created by: <b>${ seriv.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
                    Date & Time: <b><span class="date"></span></b>
                </div>
                <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
            </div>
          `,
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px' },
        });

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

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    async findSeriv(id: string): Promise<S> {
        const item = await this.prisma.sERIV.findUnique({
            select: {
                seriv_number: true,
                date_requested: true,
                created_by: true,
                approval_status: true,
                requested_by_id: true,
                consumer_name: true,
                or_number: true,
                mwo_number: true,
                cwo_number: true,
                jo_number: true,
                item_from: true,
                location: true,
                purpose: true,
                seriv_items: {
                    select: {
                        quantity: true,
                        price: true,
                        item: {
                            select: {
                                code: true,
                                unit: true,
                                description: true,
                            }
                        },
                    }
                },
                seriv_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('SERIV not found')
        }

        // @ts-ignore
        return item
    }

}
