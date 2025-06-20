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
import { MctPdfService } from './mct.pdf.service';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { Parser as Json2CsvParser } from 'json2csv';
import { formatDate, getFullname } from '../__common__/helpers';
import { MctReportService } from './mct.report.service';
import { MctSummaryQueryDto } from './dto/mct-summary-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('mct')
export class MctController {

    private readonly logger = new Logger(MctController.name);
    private filename = 'mct.controller.ts'

    constructor(
        private readonly mctPdfService: MctPdfService,
        private readonly mctReportService: MctReportService,
        private readonly audit: WarehouseAuditService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCT, RESOLVERS.printMct)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating PDF in MCT...', {
            username: authUser.user.username,
            filename: this.filename,
            mct_id: id
        })

        try {

            const mct = await this.mctPdfService.findMct(id)

            if(mct.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mctPdfService.generatePdf(mct, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })

            this.logger.log('PDF in MCT generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mct.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in MCT', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate MCT PDF', error: error.message });
        }


    }

    @Get('pdf-gate-pass/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCT, RESOLVERS.printMct)
    async generateGatePassPDF(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating gatepass PDF in MCT...', {
            username: authUser.user.username,
            filename: this.filename,
            mct_id: id
        })

        try {
    
            const mct = await this.mctPdfService.findMct(id)

            if(mct.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate gate pass pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mctPdfService.generateGatePassPdf(mct, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })

            this.logger.log('Gatepass PDF in MCT generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mct_gatepass.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error('Error in generating Gate Pass PDF in MCT', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate Gate Pass PDF in MCT', error: error.message });
        }


    }

    @Get('summary-report-csv')
    @UsePipes(new ValidationPipe())
    async generate_mct_summary_csv(
        @Res() res: Response,
        @Query() query: MctSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {
        const { startDate, endDate } = query;

        this.logger.log('Generating mct summary CSV...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        });

        try {
            // Fetch grouped data (implement this in your service)
            const groupedMcts = await this.mctReportService.get_summary_data({
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                authUser
            });

            const { employees } = await this.mctReportService.getEmployees(authUser);

            const rows = [];
            for (const [mct_number, mctArr] of Object.entries(groupedMcts)) {
                for (const mct of mctArr) {
                    // Find withdrawn_by full name
                    let withdrawn_by = 'N/A';
                    if (mct.mrv && mct.mrv.withdrawn_by_id && employees) {
                        const emp = employees.find(e => e.id === mct.mrv.withdrawn_by_id);
                        if (emp) {
                            withdrawn_by = getFullname(emp.firstname, emp.middlename, emp.lastname);
                        }
                    }
                    for (const item of mct.mrv?.mrv_items || []) {
                        rows.push({
                            mct_number: mct.mct_number,
                            or_number: mct.mrv?.or_number,
                            mwo_number: mct.mrv?.mwo_number,
                            cwo_number: mct.mrv?.cwo_number,
                            jo_number: mct.mrv?.jo_number,
                            mct_date: formatDate(mct.mct_date),
                            code: item.item.code,
                            old_code: item.item.old_code,
                            project_name: item.item.project_item?.project.name || 'N/A',
                            description: item.item.description,
                            quantity: item.quantity,
                            unit: item.item.unit.name,
                            withdrawn_by,
                            purpose: mct.mrv?.purpose,
                        });
                    }
                }
            }

            // Define CSV fields (adjust as needed)
            const fields = [
                'mct_number',
                'or_number',
                'mwo_number',
                'cwo_number',
                'jo_number',
                'mct_date',
                'code',
                'old_code',
                'project_name',
                'description',
                'quantity',
                'unit',
                'withdrawn_by',
                'purpose',
            ];
            const json2csv = new Json2CsvParser({ fields });
            const csv = json2csv.parse(rows);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=mct_summary.csv');
            res.status(200).send(csv);
        } catch (error) {
            this.logger.error('Error in generating CSV in MCT summary', error);
            res.status(500).json({ message: 'Failed to generate MCT Summary CSV', error: error.message });
        }
    }



}
