import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SprPdfService } from './spr.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { SprService } from './spr.service';
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
@Controller('spr')
export class SprController {

    private readonly logger = new Logger(SprController.name);
    private filename = 'spr.controller.ts'

    constructor(
        private readonly sprPdfService: SprPdfService,
        private readonly sprService: SprService,
        private readonly audit: WarehouseAuditService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.SPR, RESOLVERS.printSpr)
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
                function: RESOLVERS.printSpr,
                spr_id: id
            })
            
            this.sprPdfService.setAuthUser(authUser)
    
            const status = await this.sprService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const spr = await this.sprPdfService.findSpr(id)
            // @ts-ignore
            const pdfBuffer = await this.sprPdfService.generatePdf(spr, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            })
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=spr.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error(`Failed to generate PDF: SPR`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate SPR PDF', error: error.message });
        }


    }

}
