
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles, formatToPhpCurrency } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../__prisma__/prisma.service';
import { UPLOADS_PATH } from '../__common__/config';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MRV as M, MRVItem } from 'apps/warehouse/prisma/generated/client';
import { MRV } from './entities/mrv.entity';
import { warehouseRequestTypeMapper } from '../__common__/constants';

@Injectable()
export class MrvPdfService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generatePdf(mrv: MRV) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(mrv.mrv_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        // const requisitioner = await this.getEmployee(mrv.requested_by_id, this.authUser)

        const [requisitioner, withdrawn_by] = await Promise.all([
            this.getEmployee(mrv.requested_by_id, this.authUser),
            this.getEmployee(mrv.withdrawn_by_id, this.authUser),
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
                                <td style="width: 50%">MRV No.:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center">
                                    ${ mrv.mrv_number } 
                                </td>
                            </tr>     
                            <tr>
                                <td>Date:</td>
                                <td style="border-bottom: 1px solid black; font-weight: bold; text-align: center"> ${formatDate(mrv.date_requested)} </td>
                            </tr>
                        </table>
                    </div>
                
                </div>

                <br />
                <div class="heading" style="text-align: center;"> MATERIAL REQUISITION VOUCHER </div>
                <br />
                <br />

                <table border="0" style="width: 100%; font-size: 9pt; border-collapse: collapse; ">
                    <tbody>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Requested By </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; padding-top: 10px; padding-left: 10px;"> ${ getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix) } </td>
                        </tr>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Department </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; padding-top: 10px; padding-left: 10px;">
                                ${ requisitioner.department.name }
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Consumer Name </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; padding-top: 10px; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line; padding-left: 10px;">${ mrv.consumer_name }</td>
                        </tr>
                        <tr>
                            <td style="width: 20%;"> Purpose </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; padding-top: 10px; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line; padding-left: 10px;">${ mrv.purpose }</td>
                        </tr>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Request Type </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; padding-top: 10px; padding-left: 10px;">
                                ${ warehouseRequestTypeMapper[mrv.request_type] }
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Item From </td>
                            <td style="text-align: right"; padding-top: 10px;>:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; padding-top: 10px; padding-left: 10px;">
                                ${ mrv.item_from.name }
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 20%; padding-top: 10px;"> Project Location </td>
                            <td style="text-align: right; padding-top: 10px;">:</td>
                            <td style="width: 78%; border-bottom: 1px solid black; font-weight: bold; white-space: pre-line; padding-top: 10px; padding-left: 10px;">${ mrv.location }</td>
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
                        <th style="border: 1px solid black;"> Price </th>
                        <th style="border: 1px solid black;"> Total </th>
                    </thead>
                    <tbody>
                        ${mrv.mrv_items.map((mrv_item, index) => `
                        <tr style="border: 1px solid black;">
                            <td align="center">${index + 1}</td>
                            <td>${mrv_item.item.code}</td>
                            <td style="white-space: pre-line;" align="center">${mrv_item.item.description} ${ mrv_item.item.project_item ? `(${ mrv_item.item.project_item.project.name })` : '' }</td>
                            <td align="center">${mrv_item.quantity}</td>
                            <td align="center">${mrv_item.item.unit.name}</td>
                            <td align="center">${formatToPhpCurrency(mrv_item.price)}</td>
                            <td align="center">${formatToPhpCurrency(mrv_item.price * mrv_item.quantity)}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" style="font-weight: bold">Total no. of records: ${ mrv.mrv_items.length }</td>
                            <td style="font-weight: bold;  text-align: right">GRAND TOTAL:</td>
                            <td style="font-weight: bold; text-align: center">${ this.get_grand_total_price(mrv.mrv_items) }</td>
                        </tr>
                    </tfoot>
                </table>
                
                <br />

                <div>
                    <p style="text-indent: 2rem;"> 
                        <i> I hereby certify that the materials / supplies requisitioned above are necessary and will be used solely for the purpose stated above. </i>
                    </p>
                </div>

                <br />
                <br />

        
            </div>
        
            <div padding-top: 30px; display: flex; justify-content: center;">

                <div style="display: flex; flex-wrap: wrap;">
                    
                    <div style="padding: 10px; width: 45%; padding-top: 30px;"> 
                    
                        <table border="0" style="width: 100%; font-size: 8pt;">
                            <tr>
                                <td> Prepared By: </td>
                            </tr>
                            <tr>
                                <td> ${formatDate(mrv.date_requested)} </td>
                            </tr>
                            <tr>
                                <th style="text-align: center; position: relative; font-size: 10pt;">
                                    <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                        ${
                                            // @ts-ignore
                                            getFullnameWithTitles(requisitioner.firstname, requisitioner.lastname, requisitioner.middlename, requisitioner.name_prefix, requisitioner.name_suffix)
                                        }
                                    </u>
                                    <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                        // @ts-ignore
                                        this.getUploadsPath(requisitioner.signature_src)
                                    }" />
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    ${
                                        // @ts-ignore
                                        requisitioner.position ? requisitioner.position : ''
                                    }
                                </td>
                            </tr>
                        </table>

                    </div>
                    
                    <div style="padding: 10px; width: 45%; padding-top: 30px;"> 
                    
                        <table border="0" style="width: 100%; font-size: 8pt;">
                            <tr>
                                <td> Withdrawn By: </td>
                            </tr>
                            <tr>
                                <td> &nbsp; </td>
                            </tr>
                            <tr>
                                <th style="text-align: center; position: relative; font-size: 10pt;">
                                    <u style="position: relative; z-index: 1; margin-bottom: 10px;">
                                        ${
                                            // @ts-ignore
                                            getFullnameWithTitles(withdrawn_by.firstname, withdrawn_by.lastname, withdrawn_by.middlename, withdrawn_by.name_prefix, withdrawn_by.name_suffix)
                                        }
                                    </u>
                                    <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                        // @ts-ignore
                                        this.getUploadsPath(withdrawn_by.signature_src)
                                    }" />
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    ${
                                        // @ts-ignore
                                        withdrawn_by.position ? withdrawn_by.position : ''
                                    }
                                </td>
                            </tr>
                        </table>

                    </div>
                
                ${approvers.map((item, index) => `
                
                    <div style="padding: 10px; width: 45%; padding-top: 30px;">
                        <table border="0" style="width: 100%; font-size: 8pt;">
                            <tr>
                                <td> ${ item.label }: </td>
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
                    Note: System generated report | Created by: <b>${ mrv.created_by }</b> | Printed by: <b>${this.authUser.user.username}</b> | 
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

    private getUploadsPath(src: string) {

        if(!src || src.trim() === '') return 

        const path = src.replace(UPLOADS_PATH, '')
    
        const uploadsPath = this.API_FILE_ENDPOINT + path
        return uploadsPath
    }

    async findMrv(id: string): Promise<M> {
        const item = await this.prisma.mRV.findUnique({
            include: {
                item_from: true,
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
                },
                mrv_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            where: { id }
        })

        if (!item) {
            throw new NotFoundException('MRV not found')
        }

        // @ts-ignore
        return item
    }

    private get_grand_total_price(mrv_items: MRVItem[]) {

        let total_price = 0

        for(let mrv_item of mrv_items) {
            total_price += mrv_item.price * mrv_item.quantity
        }

        return formatToPhpCurrency(total_price)
    } 

}
