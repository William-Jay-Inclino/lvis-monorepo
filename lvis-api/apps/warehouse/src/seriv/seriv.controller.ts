import { Controller, Get, Logger, Param, Query, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { SerivPdfService } from './seriv.pdf.service';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { SerivSummaryQueryDto } from './dto/seriv-summary-query.dto';
import { SerivReportService } from './seriv.report.service';
import { Parser as Json2CsvParser } from 'json2csv';
import { formatDate } from '../__common__/helpers';
import { approvalStatus } from '../__common__/constants';

@UseGuards(JwtAuthGuard)
@Controller('seriv')
export class SerivController {

    private readonly logger = new Logger(SerivController.name);
    private filename = 'seriv.controller.ts'

    constructor(
        private readonly serivPdfService: SerivPdfService,
        private readonly serivReportService: SerivReportService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SERIV, RESOLVERS.printSeriv)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating PDF in SERIV...', {
            username: authUser.user.username,
            filename: this.filename,
            seriv_id: id
        })

        try {
            
            const seriv = await this.serivPdfService.findSeriv(id)

            if(seriv.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.serivPdfService.generatePdf(seriv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })
            this.logger.log('PDF in SERIV generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=seriv.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in SERIV', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate SERIV PDF', error: error.message });
        }


    }

    @Get('pdf-gate-pass/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SERIV, RESOLVERS.printSeriv)
    async generateGatePassPDF(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating gate pass PDF in SERIV...', {
            username: authUser.user.username,
            filename: this.filename,
            seriv_id: id
        })
        try {
    
            const seriv = await this.serivPdfService.findSeriv(id)
    
            if(seriv.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate gate pass pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.serivPdfService.generateGatePassPdf(seriv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })
            this.logger.log('Gatepass PDF in SERIV generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=seriv_gatepass.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error('Error in generating Gate Pass PDF in SERIV', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate canvass PDF', error: error.message });

        }


    }

    @Get('summary-report')
    @UsePipes(new ValidationPipe())
    async generate_seriv_summary_report(
        @Res() res: Response,
        @Query() query: SerivSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        const { startDate, endDate } = query;

        this.logger.log('Generating seriv summary report...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        })
        try {
            
            let title = `SUMMARY OF SERIV`

            const pdfBuffer = await this.serivReportService.generate_seriv_summary_pdf(
                {
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




            this.logger.log('PDF in seriv summary report generated')

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=seriv_summary.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in SERIV summary', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate SERIV Summary PDF', error: error.message });
        }
        
    }

    @Get('summary-report-csv')
    @UsePipes(new ValidationPipe())
    async generate_seriv_summary_csv(
        @Res() res: Response,
        @Query() query: SerivSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        const { startDate, endDate } = query;

        this.logger.log('Generating seriv summary CSV...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        });

        try {
            // Fetch grouped data
            const groupedSerivs = await this.serivReportService.get_summary_data({
                start_date: new Date(startDate),
                end_date: new Date(endDate),
            });

            // Flatten data for CSV using the required fields and order
            const rows = [];
            for (const [seriv_number, serivArr] of Object.entries(groupedSerivs)) {
                for (const seriv of serivArr) {
                    for (const item of seriv.seriv_items) {
                        rows.push({
                            seriv_number: seriv.seriv_number,
                            seriv_date: formatDate(seriv.date_requested),
                            or_number: seriv.or_number,
                            cwo_number: seriv.cwo_number,
                            mwo_number: seriv.mwo_number,
                            jo_number: seriv.jo_number,
                            created_by: seriv.created_by,
                            consumer_name: seriv.consumer_name,
                            purpose: seriv.purpose,
                            location: seriv.location,
                            code: item.item.code,
                            description: item.item.description,
                            quantity: item.quantity,
                            unit: item.item.unit.name,
                            approval_status: seriv.approval_status ? approvalStatus[seriv.approval_status].label : 'Unknown',
                        });
                    }
                }
            }

            // Convert to CSV
            const fields = [
                'seriv_number',
                'seriv_date',
                'or_number',
                'cwo_number',
                'mwo_number',
                'jo_number',
                'created_by',
                'consumer_name',
                'purpose',
                'location',
                'code',
                'description',
                'quantity',
                'unit',
                'approval_status',
            ];
            const json2csv = new Json2CsvParser({ fields });
            const csv = json2csv.parse(rows);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=seriv_summary.csv');
            res.status(200).send(csv);
        } catch (error) {
            this.logger.error('Error in generating CSV in SERIV summary', error)
            res.status(500).json({ message: 'Failed to generate SERIV Summary CSV', error: error.message });
        }
    }

}
