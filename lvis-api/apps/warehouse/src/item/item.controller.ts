import { Controller, Get, Logger, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { ItemReportService } from './item.report.service';
import { ItemSummaryQueryDto } from './dto/item-summary-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {

    private readonly logger = new Logger(ItemController.name);
    private filename = 'item.controller.ts'

    constructor(
        private report: ItemReportService,
        private readonly audit: WarehouseAuditService,
    ) {}

    @Get('summary-report')
    @UsePipes(new ValidationPipe())
    async generate_item_summary_report(
        @Res() res: Response,
        @Query() query: ItemSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate } = query;

        console.log('startDate', startDate);
        console.log('endDate', endDate);

        this.logger.log('Generating item summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        })
        try {
            
            const report_data = await this.report.generateItemTransactionsSummary({
                startDate: startDate,
                endDate: endDate,
            });

            console.log('report_data', report_data);

            // const pdfBuffer = await this.tripReportService.generate_trip_ticket_summary_pdf(
            //     {
            //         report_data,
            //         startDate,
            //         endDate,
            //         title,
            //         vehicleNumber,
            //     }, 
            //     {
            //         ip_address,
            //         device_info: this.audit.getDeviceInfo(user_agent), 
            //         authUser,
            //     }
            // )
            // this.logger.log('PDF in trip ticket summary report generated')

            // // @ts-ignore
            // res.set({
            //     'Content-Type': 'application/pdf',
            //     'Content-Disposition': 'attachment; filename=trip_ticket_summary.pdf',
            // });

            // // @ts-ignore
            // res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in trip ticket summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate Trip Ticket Summary PDF', error: error.message });
        }
        
    }
}
