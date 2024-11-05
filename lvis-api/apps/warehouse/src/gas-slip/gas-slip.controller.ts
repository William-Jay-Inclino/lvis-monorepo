import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { GasSlipPdfService } from './gas-slip.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(JwtAuthGuard)
@Controller('gas-slip')
export class GasSlipController {

    constructor(
        private readonly gasSlipPdfService: GasSlipPdfService
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    @CheckAccess(MODULES.GAS_SLIP, RESOLVERS.printGasSlip)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        console.log('id', id)
        // @ts-ignore
        console.log('authUser', authUser);

        this.gasSlipPdfService.setAuthUser(authUser)

        const gasSlip = await this.gasSlipPdfService.findGasSlip(id)
        const pdfBuffer = await this.gasSlipPdfService.generatePdf(gasSlip)

        // Set response headers
        // @ts-ignore
        res.setHeader('Content-Type', 'application/pdf');
        // @ts-ignore
        res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');

        // Send PDF buffer to client
        // @ts-ignore
        res.send(pdfBuffer);

    }

}
