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
import { McrtPdfService } from './mcrt.pdf.service';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';
import { McrtSummaryQueryDto } from './dto/mcrt-summary-query.dto';
import { McrtReportService } from './mcrt.report.service';
import { Parser as Json2CsvParser } from 'json2csv';
import { formatDate, getFullname } from '../__common__/helpers';

@UseGuards(JwtAuthGuard)
@Controller('mcrt')
export class McrtController {

    private readonly logger = new Logger(McrtController.name);
    private filename = 'mcrt.controller.ts'

    constructor(
        private readonly mcrtPdfService: McrtPdfService,
        private readonly mcrtReportService: McrtReportService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCRT, RESOLVERS.printMcrt)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating PDF in MCRT...', {
            username: authUser.user.username,
            filename: this.filename,
            mcrt_id: id
        })

        try {
            
            const mcrt = await this.mcrtPdfService.findMcrt(id)

            if(mcrt.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mcrtPdfService.generatePdf(mcrt, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })
            this.logger.log('PDF in MCRT generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mcrt.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in MCRT', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate MCRT PDF', error: error.message });
        }


    }

    @Get('summary-report-csv')
    @UsePipes(new ValidationPipe())
    async generate_mcrt_summary_csv(
        @Res() res: Response,
        @Query() query: McrtSummaryQueryDto,
        @CurrentAuthUser() authUser: AuthUser,
    ) {
        const { startDate, endDate } = query;

        this.logger.log('Generating mcrt summary CSV...', {
            username: authUser.user.username,
            filename: this.filename,
            startDate,
            endDate,
        });

        try {
            // Fetch grouped data
            const groupedMcrts = await this.mcrtReportService.get_summary_data({
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                authUser
            });

            // Fetch employees for returned_by
            const { employees } = await this.mcrtReportService.getEmployees(authUser);

            const rows = [];
            for (const [mcrt_number, mcrtArr] of Object.entries(groupedMcrts)) {
                for (const mcrt of mcrtArr) {
                    // Find returned_by full name
                    let returned_by = 'N/A';
                    if (mcrt.returned_by_id && employees) {
                        const emp = employees.find(e => e.id === mcrt.returned_by_id);
                        if (emp) {
                            returned_by = getFullname(emp.firstname, emp.middlename, emp.lastname);
                        }
                    }
                    for (const item of mcrt.mcrt_items || []) {
                        rows.push({
                            mcrt_number: mcrt.mcrt_number,
                            mcrt_date: formatDate(mcrt.mcrt_date),
                            mct_number: mcrt.mct?.mct_number || 'N/A',
                            code: item.item.code,
                            old_code: item.item.old_code || 'N/A',
                            description: item.item.description,
                            quantity: item.quantity,
                            unit: item.item.unit.name,
                            returned_by,
                            note: mcrt.note || 'N/A',
                        });
                    }
                }
            }

            // Define CSV fields
            const fields = [
                'mcrt_number',
                'mcrt_date',
                'mct_number',
                'code',
                'old_code',
                'description',
                'quantity',
                'unit',
                'returned_by',
                'note',
            ];
            const json2csv = new Json2CsvParser({ fields });
            const csv = json2csv.parse(rows);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=mcrt_summary.csv');
            res.status(200).send(csv);
        } catch (error) {
            this.logger.error('Error in generating CSV in MCRT summary', error);
            res.status(500).json({ message: 'Failed to generate MCRT Summary CSV', error: error.message });
        }
    }

}
