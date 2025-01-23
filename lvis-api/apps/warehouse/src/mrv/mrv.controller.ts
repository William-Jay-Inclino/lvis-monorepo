import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MrvPdfService } from './mrv.pdf.service';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(JwtAuthGuard)
@Controller('mrv')
export class MrvController {

    private readonly logger = new Logger(MrvController.name);
    private filename = 'mrv.controller.ts'

    constructor(
        private readonly mrvPdfService: MrvPdfService,
        private readonly audit: WarehouseAuditService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MRV, RESOLVERS.printMrv)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        try {

            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: 'generatePdf',
                mrv_id: id
            })
            
            this.mrvPdfService.setAuthUser(authUser)
    
            const mrv = await this.mrvPdfService.findMrv(id)

            console.log('mrv', mrv);
    
            if(mrv.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mrvPdfService.generatePdf(mrv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            })
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mrv.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in MRV', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate MRV PDF', error: error.message });
        }


    }

}
