import { Controller, Get, Logger, Param, Query, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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

}
