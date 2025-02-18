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

        const { startDate, endDate, departmentIds, requested_by_id, code } = query;

        this.logger.log('Generating osriv summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
            departmentIds,
            requested_by_id,
        })
        try {
            
            let title = `SUMMARY OF OSRIV (${ code })`
            let pdfBuffer

            if(requested_by_id) {
                const response = await this.report.getSummaryByRequisitioner({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    requested_by_id,

                }, authUser)

                pdfBuffer = await this.report.generate_osriv_summary_pdf_by_requisitioner(
                    {
                        report_data: response.reportData,
                        startDate,
                        endDate,
                        title,
                        requested_by_fullname: response.requested_by_fullname,
                        department_code: response.department_code,
                    }, 
                    {
                        ip_address,
                        device_info: this.audit.getDeviceInfo(user_agent), 
                        authUser,
                    }
                )


            } else {
                const response = await this.report.getSummaryByDepartments({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    departmentIds,

                }, authUser)

                pdfBuffer = await this.report.generate_osriv_summary_pdf_by_departments(
                    {
                        report_data: response,
                        startDate,
                        endDate,
                        title,
                    }, 
                    {
                        ip_address,
                        device_info: this.audit.getDeviceInfo(user_agent), 
                        authUser,
                    }
                )
            }


            this.logger.log('PDF in osriv summary report generated')

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=osriv_summary.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in OSRIV summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate OSRIV Summary PDF', error: error.message });
        }
        
    }
}
