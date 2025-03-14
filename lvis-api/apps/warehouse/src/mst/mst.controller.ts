import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MstPdfService } from './mst.pdf.service';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(JwtAuthGuard)
@Controller('mst')
export class MstController {

    private readonly logger = new Logger(MstController.name);
    private filename = 'mst.controller.ts'

    constructor(
        private readonly mstPdfService: MstPdfService,
        private readonly audit: WarehouseAuditService,
    ) { }

    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MST, RESOLVERS.printMst)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser,
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ) {

        console.log('123');

        this.logger.log('Generating PDF in MST...', {
            username: authUser.user.username,
            filename: this.filename,
            mst_id: id
        })

        try {
            
            const mst = await this.mstPdfService.findMst(id)

            if(mst.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mstPdfService.generatePdf(mst, {
                ip_address,
                device_info: this.audit.getDeviceInfo(user_agent),
                authUser,
            })
            this.logger.log('PDF in MST generated')
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mst.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
        } catch (error) {
            this.logger.error('Error in generating PDF in MST', error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate MST PDF', error: error.message });
        }


    }

}
