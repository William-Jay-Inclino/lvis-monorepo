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

    @Get('summary-report-transactions')
    @UsePipes(new ValidationPipe())
    async generate_item_transactions_summary_report(
        @Res() res: Response,
        @Query() query: ItemSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate } = query;

        console.log('startDate', startDate);
        console.log('endDate', endDate);

        this.logger.log('Generating item transactions summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        })
        try {
            
            const report_data = await this.report.generate_item_transaction_summary_data({
                startDate: startDate,
                endDate: endDate,
            });

            console.log('report_data', report_data);

            const pdfBuffer = await this.report.generate_item_transaction_summary_pdf(
                {
                    report_data,
                    startDate,
                    endDate,
                    title: 'SUMMARY OF ITEM TRANSACTIONS',
                }, 
                {
                    ip_address,
                    device_info: this.audit.getDeviceInfo(user_agent), 
                    authUser,
                }
            )
            this.logger.log('PDF in item transactions summary report generated')

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=item_transactions_summary.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in item transactions summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate Item Transacations Summary PDF', error: error.message });
        }
        
    }

    @Get('summary-report-transactions-by-code')
    @UsePipes(new ValidationPipe())
    async generate_item_transactions_by_code_summary_report(
        @Res() res: Response,
        @Query() query: ItemSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate } = query;

        console.log('startDate', startDate);
        console.log('endDate', endDate);

        this.logger.log('Generating item transactions by code summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        })
        try {
            
            const report_data = await this.report.generate_item_transaction_by_code_summary_data({
                startDate: startDate,
                endDate: endDate,
            });

            console.log('report_data', report_data);

            const pdfBuffer = await this.report.generate_item_transaction_by_code_summary_pdf(
                {
                    report_data,
                    startDate,
                    endDate,
                    title: 'SUMMARY OF ITEM TRANSACTIONS BY CODE',
                }, 
                {
                    ip_address,
                    device_info: this.audit.getDeviceInfo(user_agent), 
                    authUser,
                }
            )
            this.logger.log('PDF in item transactions by code summary report generated')

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=item_transactions_by_code_summary.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in item transactions by code summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate Item Transacations By Code Summary PDF', error: error.message });
        }
        
    }

}
