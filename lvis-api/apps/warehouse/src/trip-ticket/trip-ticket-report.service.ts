import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { HttpService } from '@nestjs/axios';
import puppeteer from 'puppeteer';
import { formatDate, getFullnameWithTitles, getImageAsBase64 } from '../__common__/helpers';
import { formatDateToMMDDYY, formatDateToTime } from '../__common__/utils';
import { catchError, firstValueFrom } from 'rxjs';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { DB_TABLE } from '../__common__/types';

@Injectable()
export class TripTicketReportService {

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

    async generate_trip_ticket_summary_pdf(
        payload: {
            report_data: any, 
            startDate: string, 
            endDate: string, 
            title: string,
            vehicleNumber?: string,
        },
        metadata: { ip_address: string, device_info: any }
    ) {

        const { report_data, startDate, endDate, title, vehicleNumber } = payload 

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

                <div style="text-align: center; margin-top: 15px;">
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
                                <th rowspan="2">No.</th>
                                <th rowspan="2">Vehicle Number</th>
                                <th rowspan="2">Plate Number</th>
                                <th rowspan="2">Driver</th>
                                <th rowspan="2">Vehicle Name</th>
                                <th style="white-space: nowrap;" colspan="2">Estimated Departure</th>
                                <th style="white-space: nowrap;" colspan="2">Actual Departure</th>
                                <th colspan="2">Arrival</th>
                                <th rowspan="2">Destination</th>
                                <th rowspan="2">Purpose</th>
                                <th rowspan="2">Passengers</th>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>

                        <tbody style="font-size: 8pt;">
                        ${Object.keys(report_data).map(date => {
                            return `
                            <tr>
                                <td colspan="14" style="text-align: left;">
                                    ${ !!vehicleNumber ? `<span class="text-muted">Date Prepared:</span> <b>${ date }</b>` : `<span class="text-muted">Estimated Departure: </span> <b>${ date }</b>` } 
                                </td>
                            </tr>
                            ${report_data[date].map((trip: any, indx: number) => `
                            <tr>
                                <td>${ ctr++ }</td>
                                <td style="white-space: nowrap;">${trip.vehicle.vehicle_number}</td>
                                <td style="white-space: nowrap;">${trip.vehicle.plate_number}</td>
                                <td>${getFullnameWithTitles(trip.driver.firstname, trip.driver.lastname, trip.driver.middlename)}</td>
                                <td>${trip.vehicle.name}</td>
                                <td style="white-space: nowrap;">${ formatDateToMMDDYY(trip.start_time) }</td>
                                <td style="white-space: nowrap;">${ formatDateToTime(trip.start_time) }</td>
                                <td style="white-space: nowrap;">${ formatDateToMMDDYY(trip.actual_start_time) }</td>
                                <td style="white-space: nowrap;">${ formatDateToTime(trip.actual_start_time) }</td>
                                <td style="white-space: nowrap;">${ formatDateToMMDDYY(trip.actual_end_time) }</td>
                                <td style="white-space: nowrap;">${ formatDateToTime(trip.actual_end_time) }</td>
                                <td style="white-space: pre-line;">${trip.destination}</td>
                                <td style="white-space: pre-line;">${trip.purpose}</td>
                                <td>${trip.passengers && trip.passengers.trim() !== '' ? trip.passengers : ''}</td>
                            </tr>
                            `).join('')}
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
            headerTemplate: ``,
            footerTemplate: `
            <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
                padding: 5px 5px 0; color: #bbb; position: relative;">
                <div style="position: absolute; left: 5px; top: 5px;">
                    Note: System generated report | Printed by: <b>${this.authUser.user.username}</b> | 
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
            table: DB_TABLE.TRIP_TICKET,
            action: 'PRINT-TRIP-TICKET-SUMMARY',
            reference_id: 'N/A',
            metadata: {
                'start_date': startDate,
                'end_date': endDate,
                'report_title': title,
                'vehicle_number': vehicleNumber || 'N/A'
            },
            ip_address: metadata.ip_address,
            device_info: metadata.device_info
        })

        return pdfBuffer;
    }

    async generateTripTicketSummaryReport(filters: {
        startDate: Date;
        endDate: Date;
        vehicleNumber?: string;
        vehicleType?: 'SV' | 'VH';
        allVehicles?: boolean;
    }) {
        const { startDate, endDate, vehicleNumber, vehicleType, allVehicles } = filters;

        console.log('filters', filters);

        // Validate required fields
        if (!startDate || !endDate) {
            throw new BadRequestException('Start date and end date are required.');
        }

        if (startDate > endDate) {
            throw new BadRequestException('Start date cannot be later than end date.');
        }

        // Construct the query conditions
        const where: any = {
            start_time: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (vehicleNumber) {
            where.vehicle = { vehicle_number: vehicleNumber };
        } else if (vehicleType) {
            where.vehicle = {
                vehicle_number: {
                    startsWith: `${vehicleType}-`, // e.g., 'SV-' or 'VH-'
                },
            };
        }

        if (allVehicles) {
            delete where.vehicle; 
        }

        // Fetch the data
        const tripTickets = await this.prisma.tripTicket.findMany({
            where,
            include: {
                vehicle: true,
            },
            orderBy: {
                start_time: 'asc',
            },
        });

        const _tripTickets = await Promise.all(tripTickets.map(async (i) => {
            i['driver'] = await this.getEmployee(i.driver_id, this.authUser);
            return i;
        }));


        if(vehicleNumber) {

            const groupedByCreatedAt = _tripTickets.reduce((acc, ticket) => {
    
                const createdAt = ticket.created_at as unknown as string
    
                const date = createdAt.split(' ')[0]; 
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(ticket);
                return acc;
            }, {} as Record<string, any[]>);
            
            return groupedByCreatedAt;
            
        } else {

            const groupedByDay = _tripTickets.reduce((acc, ticket) => {
    
                const startTime = ticket.start_time as unknown as string
    
                const date = startTime.split(' ')[0]; 
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(ticket);
                return acc;
            }, {} as Record<string, any[]>);
            
            return groupedByDay;

        }
        
    }


    private async getEmployee(employeeId: string, authUser: AuthUser) {

        const query = `
            query {
                employee(id: "${ employeeId }") {
                    firstname 
                    middlename 
                    lastname
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
}
