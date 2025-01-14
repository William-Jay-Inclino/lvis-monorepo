import { Controller, Get, Logger, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TripTicketReportService } from './trip-ticket-report.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TripTicketSummaryQueryDto } from './dto/trip-ticket-summary-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('trip-ticket')
export class TripTicketController {

    private readonly logger = new Logger(TripTicketController.name);
    private filename = 'trip-ticket.controller.ts'

    constructor(private tripReportService: TripTicketReportService) {}

    @Get('summary-report')
    @UsePipes(new ValidationPipe())
    async generate_trip_ticket_summary_report(
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @Query() query: TripTicketSummaryQueryDto,
    ) {

        const { startDate, endDate, vehicleNumber, vehicleType, allVehicles } = query;
        console.log('query', query);

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
                allVehicles: allVehicles === 'true',
            });

            let title = 'SUMMARY OF TRIP TICKET'

            if(allVehicles) {
                title += ' (All Vehicles)'
            } else if(vehicleType) {
                title += ` (${ vehicleType })`
            } else if(vehicleNumber) {
                title += ` (${ vehicleNumber.toUpperCase() })`
            }

            const pdfBuffer = await this.tripReportService.generate_trip_ticket_summary_pdf({
                report_data,
                startDate,
                endDate,
                title,
                vehicleNumber,
            })

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
