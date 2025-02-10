import { Controller, Get, Logger, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { OsrivReportService } from './osriv.report.service';
import { OsrivSummaryQueryDto } from './dto/osriv-summary-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('osriv')
export class OsrivController {

    private readonly logger = new Logger(OsrivController.name);
    private filename = 'osriv.controller.ts'

    constructor(
        private report: OsrivReportService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Get('summary-report')
    @UsePipes(new ValidationPipe())
    async generate_trip_ticket_summary_report(
        @Res() res: Response,
        @Query() query: OsrivSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate, departmentIds, requested_by_id } = query;

        this.logger.log('Generating osriv summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
            departmentIds,
            requested_by_id,
        })
        try {
            
            const report_data = await this.report.generateOsrivSummaryReport({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                departmentIds,
                requested_by_id,
            }, authUser);
            
            this.logger.log('PDF in trip ticket summary report generated')

            // @ts-ignore
            // res.set({
            //     'Content-Type': 'application/pdf',
            //     'Content-Disposition': 'attachment; filename=trip_ticket_summary.pdf',
            // });

            // @ts-ignore
            // res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in OSRIV summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate OSRIV Summary PDF', error: error.message });
        }
        
    }
}
