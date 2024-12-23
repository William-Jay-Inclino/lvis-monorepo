import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MctPdfService } from './mct.pdf.service';

@UseGuards(JwtAuthGuard)
@Controller('mct')
export class MctController {

    private readonly logger = new Logger(MctController.name);
    private filename = 'mct.controller.ts'

    constructor(
        private readonly mctPdfService: MctPdfService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MCT, RESOLVERS.printMct)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {

            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: 'generatePdf',
                mct_id: id
            })
            
            this.mctPdfService.setAuthUser(authUser)
    
            const mct = await this.mctPdfService.findMct(id)

            console.log('mct', mct);
    
            if(mct.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mctPdfService.generatePdf(mct)
    
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
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {

            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: 'generateGatePassPDF',
                mct_id: id
            })
            
            this.mctPdfService.setAuthUser(authUser)
    
            const mct = await this.mctPdfService.findMct(id)

            console.log('mct', mct);
    
            if(mct.approval_status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate gate pass pdf. Status is not approved')
            }
    
            // @ts-ignore
            const pdfBuffer = await this.mctPdfService.generateGatePassPdf(mct)
    
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

}
