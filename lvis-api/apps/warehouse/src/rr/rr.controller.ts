import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RrPdfService } from './rr.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { RrService } from './rr.service';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(JwtAuthGuard)
@Controller('rr')
export class RrController {

    private readonly logger = new Logger(RrController.name);
    private filename = 'rr.controller.ts'

    constructor(
        private readonly rrPdfService: RrPdfService,
        private readonly rrService: RrService,
        private readonly audit: WarehouseAuditService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.RR, RESOLVERS.printRr)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log("Generating PDF in RR...", {
            username: authUser.user.username,
            filename: this.filename,
            rr_id: id
        })

        try {
            const status = await this.rrService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const rr = await this.rrPdfService.findRr(id)
            // @ts-ignore
            const pdfBuffer = await this.rrPdfService.generatePdf(rr, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })
            this.logger.log('PDF in RR generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=rr.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error(`Failed to generate PDF: RR`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate rr PDF', error: error.message });
        }


    }

}
