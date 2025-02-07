import { Controller, Get, Logger, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TripTicketReportService } from './trip-ticket-report.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { TripTicketSummaryQueryDto } from './dto/trip-ticket-summary-query.dto';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(JwtAuthGuard)
@Controller('trip-ticket')
export class TripTicketController {

    private readonly logger = new Logger(TripTicketController.name);
    private filename = 'trip-ticket.controller.ts'

    constructor(
        private tripReportService: TripTicketReportService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Get('summary-report')
    @UsePipes(new ValidationPipe())
    async generate_trip_ticket_summary_report(
        @Res() res: Response,
        @Query() query: TripTicketSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate, vehicleNumber, vehicleType, allVehicles } = query;

        this.logger.log('Generating trip ticket summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
            vehicleNumber,
            vehicleType,
            allVehicles
        })
        try {
            
            const report_data = await this.tripReportService.generateTripTicketSummaryReport({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                vehicleNumber,
                vehicleType,
                allVehicles: allVehicles === 'true',
            }, authUser);

            let title = 'SUMMARY OF TRIP TICKET'

            if(allVehicles) {
                title += ' (All Vehicles)'
            } else if(vehicleType) {
                title += ` (${ vehicleType })`
            } else if(vehicleNumber) {
                title += ` (${ vehicleNumber.toUpperCase() })`
            }

            const pdfBuffer = await this.tripReportService.generate_trip_ticket_summary_pdf(
                {
                    report_data,
                    startDate,
                    endDate,
                    title,
                    vehicleNumber,
                }, 
                {
                    ip_address,
                    device_info: this.audit.getDeviceInfo(user_agent), 
                    authUser,
                }
            )
            this.logger.log('PDF in trip ticket summary report generated')

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
