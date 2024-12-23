import { Controller, Get, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PoPdfService } from './po.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { PoService } from './po.service';
import { APPROVAL_STATUS } from '../__common__/types';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

@UseGuards(JwtAuthGuard)
@Controller('po')
export class PoController {

    private readonly logger = new Logger(PoController.name);
    private filename = 'po.controller.ts'

    constructor(
        private readonly poPdfService: PoPdfService,
        private readonly poService: PoService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.PO, RESOLVERS.printPo)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        try {

            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: RESOLVERS.printPo,
                po_id: id
            })
            
            this.poPdfService.setAuthUser(authUser)
    
            const status = await this.poService.getStatus(id)
    
            if(status !== APPROVAL_STATUS.APPROVED) {
                throw new UnauthorizedException('Cannot generate pdf. Status is not approvedf')
            }
    
            const po = await this.poPdfService.findPo(id)
            // @ts-ignore
            const pdfBuffer = await this.poPdfService.generatePdf(po)
    
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=po.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);

        } catch (error) {
            this.logger.error(`Failed to generate PDF: PO`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate po PDF', error: error.message });
        }


    }

}
