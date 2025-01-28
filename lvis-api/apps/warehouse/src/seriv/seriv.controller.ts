import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
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

@UseGuards(JwtAuthGuard)
@Controller('seriv')
export class SerivController {

    private readonly logger = new Logger(SerivController.name);
    private filename = 'seriv.controller.ts'

    constructor(
        private readonly serivPdfService: SerivPdfService,
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
            
            this.serivPdfService.setAuthUser(authUser)
    
            const seriv = await this.serivPdfService.findSeriv(id)

            if(seriv.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.serivPdfService.generatePdf(seriv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
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
            
            this.serivPdfService.setAuthUser(authUser)
    
            const seriv = await this.serivPdfService.findSeriv(id)
    
            if(seriv.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate gate pass pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.serivPdfService.generateGatePassPdf(seriv, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent)
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

}
