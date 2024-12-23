import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MeqsPdfService } from './meqs.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MeqsService } from './meqs.service';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

@UseGuards(JwtAuthGuard)
@Controller('meqs')
export class MeqsController {

    private readonly logger = new Logger(MeqsController.name);
    private filename = 'meqs.controller.ts'

    constructor(
        private readonly meqsPdfService: MeqsPdfService,
        private readonly meqsService: MeqsService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.MEQS, RESOLVERS.printMeqs)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {
            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: RESOLVERS.printMeqs,
                meqs_id: id
            })

            this.meqsPdfService.setAuthUser(authUser)
    
            const status = await this.meqsService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const meqs = await this.meqsPdfService.findMeqs(id)
            // @ts-ignore
            const pdfBuffer = await this.meqsPdfService.generatePdf(meqs)
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=meqs.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error(`Failed to generate PDF: MEQS`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate meqs PDF', error: error.message });
        }


    }

}
