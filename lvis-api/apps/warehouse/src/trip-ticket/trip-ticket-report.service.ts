import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { HttpService } from '@nestjs/axios';
import { TripTicket } from 'apps/warehouse/prisma/generated/client';
import puppeteer from 'puppeteer';
import { getImageAsBase64 } from '../__common__/helpers';

@Injectable()
export class TripTicketReportService {

    private authUser: AuthUser
    private API_FILE_ENDPOINT = process.env.API_URL + '/api/v1/file-upload'

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    setAuthUser(authUser: AuthUser) {
        this.authUser = authUser
    }

    async generate_trip_ticket_summary_pdf(report_data: any) {
        // const browser = await puppeteer.launch();

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const watermark = getImageAsBase64('lvis-watermark-v2.png')
        const logo = getImageAsBase64('leyeco-logo.png')

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

        console.log('where', where);

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

        console.log('tripTickets', tripTickets);

        const groupedByDay = tripTickets.reduce((acc, ticket) => {

            const startTime = ticket.start_time as unknown as string

            console.log('startTime', startTime);

            const date = startTime.split(' ')[0]; // Split at space and take the first part (date)
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(ticket);
            return acc;
        }, {} as Record<string, any[]>);
        
        console.log('Grouped By Day:', groupedByDay);

        return groupedByDay;
    }
}
