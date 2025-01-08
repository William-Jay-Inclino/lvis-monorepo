// pdf.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { formatDate, getImageAsBase64, getFullnameWithTitles } from '../__common__/helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Employee } from '../__employee__/entities/employee.entity';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { GasSlip } from './entities/gas-slip.entity';
import { VehicleClassificationMapper } from '../vehicle/entities/vehicle.enums';
import { UPLOADS_PATH } from '../__common__/config';

@Injectable()
export class GasSlipPdfService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'


    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generatePdf(gasSlip: GasSlip) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const logo = getImageAsBase64('leyeco-logo.png')

        const approvers = await Promise.all(gasSlip.gas_slip_approvers.map(async (i) => {
            i.approver = await this.getEmployee(i.approver_id, this.authUser);
            return i;
        }));

        const [vehicle_assignee, requested_by, driver] = await Promise.all([
            this.getEmployee(gasSlip.vehicle.assignee_id, this.authUser),
            this.getEmployee(gasSlip.requested_by_id, this.authUser),
            this.getEmployee(gasSlip.driver_id, this.authUser),
        ])

        const immediate_superior = approvers.find(i => i.order === 1)
        const department_head = approvers.find(i => i.order === 2)

        const columns = [1, 2]

        // Set content of the PDF
        const content = `
            <style>

                body {
                    font-family: Arial, sans-serif; 
                    font-size: 8pt;
                    margin: 0;
                    padding: 0;
                }

                .heading {
                    font-family: 'Georgia', serif; 
                    font-size: 11pt;
                    font-weight: bold;
                }
                .container {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    padding-left: 25px;
                    padding-right: 25px;
                    font-size: 9pt;
                }
                .column {
                    position: relative;
                    z-index: 1;
                    width: 48%; /* Leave some space between the columns */
                    padding: 10px;
                    box-sizing: border-box;
                }
                .column:last-child {
                    border-right: none;
                }
                .content-header {
                    text-align: center;
                    margin-top: 35px;
                }
                .logo-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .logo-container img {
                    height: 50px;
                    width: 50px;
                    margin-right: 10px;
                }
                .watermark-container {
                    position: relative;
                    overflow: hidden;
                }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-30deg); /* Slanting the watermark */
                    font-size: 55pt; /* Large font size to cover the column */
                    font-weight: bold;
                    color: rgba(0, 0, 0, 0.1); /* More transparent */
                    white-space: nowrap;
                    z-index: 0;
                    user-select: none; 
                    pointer-events: none; 
                }
            </style>
        
            <div class="container">

                ${ columns.map( (item, indx) =>  `

                    <div class="column ${indx === 0 ? 'watermark-container' : ''}">

                        ${indx === 0 ? `
                        <div class="watermark">ORIGINAL</div>
                        ` : ''}
    
                        <div class="content-header">
                            <div class="logo-container">
                                <div style="display: flex; align-items: center;">
                                    <img src="data:image/jpeg;base64,${logo}" alt="Logo">
                                    <div>
                                        <span class="heading">LEYTE V ELECTRIC COOPERATIVE, INC.</span>
                                        <div style="font-size: 9pt;">
                                            <span>Brgy. San Pablo, Ormoc City, Leyte</span><br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div style="display: flex; justify-content: flex-end; margin-top: 20px; margin-bottom: 10px;">
                            <table style="font-size: 8pt">
                                <tr>
                                    <td> GS No.: </td>
                                    <td style="border-bottom: 1px solid black; font-weight: bold">
                                        ${ gasSlip.gas_slip_number }
                                    </td>
                                </tr>     
                                <tr>
                                    <td> Date: </td>
                                    <td style="border-bottom: 1px solid black; font-weight: bold"> ${ formatDate(gasSlip.used_on) } </td>
                                </tr>     
                            </table>
                        </div>
    
                        <div class="heading" style="text-align: center;">GAS SLIP</div>
    
                        <br />
    
                        <table style="font-size: 8pt; width: 100%">
                            <tr>
                                <td style="width: 10%;"> To: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${ gasSlip.gas_station.name }
                                </td>
                            </tr>    
                            <tr>
                                <td></td>
                                <td style="text-align: center">
                                    Gas Station
                                </td>
                            </tr>     
                        </table>
    
                        <br />
                        <br />
    
                        <table style="font-size: 8pt; width: 100%">
                            <tr>
                                <td style="width: 30%;"> Vehicle Class: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${ VehicleClassificationMapper[gasSlip.vehicle.classification_id] }
                                </td>
                            </tr>    
                            <tr>
                                <td style="width: 30%;"> Requesting Div / Dept: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${
                                        // @ts-ignore
                                        !!vehicle_assignee.division ? vehicle_assignee.division.name : vehicle_assignee.department.name 
                                    }
                                </td>
                            </tr>    
                            <tr>
                                <td style="width: 30%;"> Please issue to: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${
                                        // @ts-ignore
                                        getFullnameWithTitles(driver.firstname, driver.lastname, driver.middlename, driver.name_prefix, driver.name_suffix)
                                    }
                                </td>
                            </tr>    
                            <tr>
                                <td style="width: 30%;"> Vehicle: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${ gasSlip.vehicle.vehicle_number + ' ' + gasSlip.vehicle.name }
                                </td>
                            </tr>   
                            <tr>
                                <td style="width: 30%;"> Plate No.: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${ gasSlip.vehicle.plate_number }
                                </td>
                            </tr> 
                        </table>
    
                        <br />
    
                        <table style="font-size: 8pt; width: 100%; border-collapse: collapse; border: 1px solid;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid; text-align: center;">Type of Fuel</th>
                                    <th style="border: 1px solid; text-align: center;">No. of Liters</th>
                                    <th style="border: 1px solid; text-align: center;">Actual No. of Liters</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="border: 1px solid; text-align: center; padding: 10px 0;">${gasSlip.fuel_type.name}</td>
                                    <td style="border: 1px solid; text-align: center; padding: 10px 0;">${gasSlip.liter_in_text}</td>
                                    <td style="border: 1px solid; text-align: center; padding: 10px 0;"> </td>
                                </tr>
                            </tbody>
                        </table>
    
                        <br />
    
                        <table style="font-size: 8pt; width: 100%">
                            <tr>
                                <td style="width: 30%;"> Previous Reading: </td>
                                <td style="border-bottom: 1px solid black;">
                                    
                                </td>
                                <td style="width: 30%;"> Present Reading: </td>
                                <td style="border-bottom: 1px solid black;">
                                    
                                </td>
                            </tr>    
                        </table>
    
                        <table style="font-size: 8pt; width: 100%">
                            <tr>
                                <td style="width: 15%;"> Purpose: </td>
                                <td style="border-bottom: 1px solid black;">
                                    ${ gasSlip.purpose }
                                </td>
                            </tr>    
                        </table>
    
                        <br />
    
                        <div style="font-size: 8pt;">
                            <b> Note: </b> Conversion of type of fuel is not allowed
                        </div>
    
    
                        <div style="margin-top: 25px;">
    
                            <div style="display: flex; justify-content: flex-end;">
                                <div style="padding: 10px; width: 70%;">
                                    <table border="0" style="width: 100%; font-size: 8pt;">
                                        <tr>
                                            <td> Noted By: </td>
                                        </tr>
                                        <tr>
                                            <td> ${formatDate(immediate_superior.date_approval, true)} </td>
                                        </tr>
                                        <tr>
                                            <th style="text-align: center; position: relative; font-size: 9pt; padding-top: 15px;">
                                                <u style="position: relative; z-index: 1; margin-bottom: 9px;">
                                                    ${
                                                        // @ts-ignore
                                                        getFullnameWithTitles(immediate_superior.approver.firstname, immediate_superior.approver.lastname, immediate_superior.approver.middlename, immediate_superior.approver.name_prefix, immediate_superior.approver.name_suffix)
                                                    }
                                                </u>
                                                <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                                    // @ts-ignore
                                                    this.getUploadsPath(immediate_superior.approver.signature_src)
                                                }" />
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center">
                                                ${ immediate_superior.label }
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                </div>
                            </div>

                            <div style="display: flex; justify-content: flex-start;">
                                <div style="padding: 10px; width: 70%;">
                                    <table border="0" style="width: 100%; font-size: 8pt;">
                                        <tr>
                                            <td> Order Authorized By: </td>
                                        </tr>
                                        <tr>
                                            <td> ${formatDate(department_head.date_approval, true)} </td>
                                        </tr>
                                        <tr>
                                            <th style="text-align: center; position: relative; font-size: 9pt; padding-top: 15px;">
                                                <u style="position: relative; z-index: 1; margin-bottom: 9px;">
                                                    ${
                                                        // @ts-ignore
                                                        getFullnameWithTitles(department_head.approver.firstname, department_head.approver.lastname, department_head.approver.middlename, department_head.approver.name_prefix, department_head.approver.name_suffix)
                                                    }
                                                </u>
                                                <img style="width: 100px; height: 100px; position: absolute; top: -60px; left: 50%; transform: translateX(-50%); z-index: 2;" src="${ 
                                                    // @ts-ignore
                                                    this.getUploadsPath(department_head.approver.signature_src)
                                                }" />
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center">
                                                Authorized Officer
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                </div>
                            </div>

                            <div style="display: flex; justify-content: flex-end;">
                                <div style="padding: 10px; width: 70%;">
                                    <table border="0" style="width: 100%; font-size: 8pt;">
                                        <tr>
                                            <td style="padding-bottom: 15px;"> Order Issued By: </td>
                                        </tr>
                                        <tr>
                                            <td> &nbsp; </td>
                                        </tr>
                                        <tr>
                                            <th style="text-align: center; position: relative; font-size: 8pt;">
                                                <u style="display: inline-block; width: 100%; height: 1px; background-color: black; margin-top: 10px;"></u>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center;">
                                                Gas Station Rep.
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                </div>
                            </div>


                            <div style="font-size: 7pt;">
                                <div>
                                    ${ indx === 0 ? 'Original Copy' : 'Duplicate Copy' }
                                </div>
                                <div>
                                    Reprinted: ${ gasSlip.print_count }
                                </div>
                                <div>
                                    ${ this.authUser.user.username }
                                </div>
                            </div>

                        </div>

    
                    </div>
                    
                `).join('') }



            </div>
        `;
    

        await page.setContent(content);
        
        const pdfArrayBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            // displayHeaderFooter: true,
            headerTemplate: ``,
        //     footerTemplate: `
        //     <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
        //         padding: 5px 5px 0; color: #bbb; position: relative;">
        //         <div style="position: absolute; left: 5px; top: 5px;">
        //             Note: System generated report | Created by: <b>${ gasSlip.created_by }</b> | Printed by: <b>${ this.authUser.user.username }</b> | 
        //             Date & Time: <b><span class="date"></span></b>
        //         </div>
        //         <div style="position: absolute; right: 5px; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
        //     </div>
        //   `,
            // this is needed to prevent content from being placed over the footer
            margin: { bottom: '70px' },
          });

        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        await browser.close();

        return pdfBuffer;
    }

    async findGasSlip(id: string) {
        
        const gasSlip = await this.prisma.gasSlip.findUnique({
            where: { id },
            include: {
                gas_station: true,
                vehicle: true,
                fuel_type: true,
                gas_slip_approvers: {
                    orderBy: {
                        order: 'asc'
                    }
                },
            }
        }) 

        if(!gasSlip) {
            throw new NotFoundException('Gas slip not found with id ' + id)
        }

        return gasSlip
    }

    async increment_print_count(gas_slip_id: string) {
        await this.prisma.gasSlip.update({
            where: { id: gas_slip_id },
            data: {
                print_count: {
                    increment: 1
                }
            }
        })
    }

    async decrement_print_count(gas_slip_id: string) {
        await this.prisma.gasSlip.update({
            where: { id: gas_slip_id },
            data: {
                print_count: {
                    decrement: 1
                }
            }
        })
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
                    department {
                        name
                    }
                    division {
                        name
                    }
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

}
