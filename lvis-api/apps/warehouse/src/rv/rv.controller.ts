import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RvPdfService } from './rv.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { RvService } from './rv.service';
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
@Controller('rv')
export class RvController {

    private readonly logger = new Logger(RvController.name);
    private filename = 'rv.controller.ts'

    constructor(
        private readonly rvPdfService: RvPdfService,
        private readonly rvService: RvService,
        private readonly audit: WarehouseAuditService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.RV, RESOLVERS.printRv)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        this.logger.log('Generating PDF in RV...', {
            username: authUser.user.username,
            filename: this.filename,
            rv_id: id
        })
        try {

            this.rvPdfService.setAuthUser(authUser)
            const status = await this.rvService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const rv = await this.rvPdfService.findRv(id)
            // @ts-ignore
            const pdfBuffer = await this.rvPdfService.generatePdf(rv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            })
            this.logger.log('PDF in RV generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=rv.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            // @ts-ignore
            this.logger.error(`Failed to generate PDF: RV`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate RV PDF', error: error.message });
        }


    }

}
