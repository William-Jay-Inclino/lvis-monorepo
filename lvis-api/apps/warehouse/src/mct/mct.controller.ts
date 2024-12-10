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
            res.setHeader('Content-Type', 'application/pdf');
            // @ts-ignore
            res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
    
            // Send PDF buffer to client
            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error('Error in generating PDF in MCT', error)
        }


    }

}
