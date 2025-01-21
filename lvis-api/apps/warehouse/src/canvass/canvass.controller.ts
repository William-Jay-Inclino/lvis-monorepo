import { Controller, Get, Logger, Param, Req, Res, UseGuards } from '@nestjs/common';
import { CanvassPdfService } from './canvass.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { Request } from 'express';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { normalizeIp } from '../__common__/utils';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(JwtAuthGuard)
@Controller('canvass')
export class CanvassController {

    private readonly logger = new Logger(CanvassController.name);
    private filename = 'canvass.controller.ts'

    constructor(
        private readonly canvassPdfService: CanvassPdfService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Get('pdf/:id')
    @UseGuards(JwtAuthGuard, AccessGuard)
    @CheckAccess(MODULES.CANVASS, RESOLVERS.printCanvass)
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
                function: RESOLVERS.printCanvass,
                canvass_id: id
            })

            this.canvassPdfService.setAuthUser(authUser)
            const canvass = await this.canvassPdfService.findCanvass(id)
            // @ts-ignore
            const pdfBuffer = await this.canvassPdfService.generatePdf(canvass, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
            })

            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=canvass.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error(`Failed to generate PDF: Canvass`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate canvass PDF', error: error.message });
        }
    }

    @Get('health-check')
    test() {
        return 'warehouse OK'
    }

}
