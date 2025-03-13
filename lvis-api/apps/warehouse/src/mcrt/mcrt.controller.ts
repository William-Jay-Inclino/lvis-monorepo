import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
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

@UseGuards(JwtAuthGuard)
@Controller('mcrt')
export class McrtController {

    private readonly logger = new Logger(McrtController.name);
    private filename = 'mcrt.controller.ts'

    constructor(
        private readonly mcrtPdfService: McrtPdfService,
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

        console.log('123');

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

}
