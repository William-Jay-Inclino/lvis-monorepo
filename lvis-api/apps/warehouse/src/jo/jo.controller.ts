import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JoPdfService } from './jo.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { JoService } from './jo.service';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(JwtAuthGuard)
@Controller('jo')
export class JoController {

    private readonly logger = new Logger(JoController.name);
    private filename = 'jo.controller.ts'

    constructor(
        private readonly joPdfService: JoPdfService,
        private readonly joService: JoService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.JO, RESOLVERS.printJo)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {

            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: RESOLVERS.printJo,
                jo_id: id
            })
            
            this.joPdfService.setAuthUser(authUser)
    
            const status = await this.joService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const jo = await this.joPdfService.findJo(id)
            // @ts-ignore
            const pdfBuffer = await this.joPdfService.generatePdf(jo)
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=jo.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error(`Failed to generate PDF: JO`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate JO PDF', error: error.message });

        }


    }

}
