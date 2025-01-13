import { Controller, Get, Logger, Query, Res, UseGuards } from '@nestjs/common';
import { TripTicketReportService } from './trip-ticket-report.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(JwtAuthGuard)
@Controller('trip-ticket')
export class TripTicketController {

    private readonly logger = new Logger(TripTicketController.name);
    private filename = 'trip-ticket.controller.ts'

    constructor(private tripReportService: TripTicketReportService) {}

    @Get('summary-report')
    async generate_trip_ticket_summary_report(
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('vehicleNumber') vehicleNumber?: string,
        @Query('vehicleType') vehicleType?: 'SV' | 'VH',
        @Query('allVehicles') allVehicles?: boolean,
    ) {

        console.log('generate_trip_ticket_summary_report');
        console.log('startDate', startDate);
        console.log('endDate', endDate);
        console.log('vehicleNumber', vehicleNumber);

        try {
            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: 'generate_trip_ticket_summary_report',
                startDate,
                endDate,
                vehicleNumber,
                vehicleType,
                allVehicles
            })
            
            this.tripReportService.setAuthUser(authUser)

            const report_data = await this.tripReportService.generateTripTicketSummaryReport({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                vehicleNumber,
                vehicleType,
                allVehicles,
            });

            console.log('report_data', report_data);

            const pdfBuffer = await this.tripReportService.generate_trip_ticket_summary_pdf(report_data)

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=trip_ticket_summary.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in trip ticket summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate Trip Ticket Summary PDF', error: error.message });
        }
        
    }
}
