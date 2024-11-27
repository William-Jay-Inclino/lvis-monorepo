import { Controller, Get, InternalServerErrorException, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GasSlipPdfService } from './gas-slip.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { GasSlipService } from './gas-slip.service';

@UseGuards(JwtAuthGuard)
@Controller('gas-slip')
export class GasSlipController {

    constructor(
        private readonly gasSlipPdfService: GasSlipPdfService,
        private readonly gasSlipService: GasSlipService,
    ) { }


    @Get('pdf/:id')
    @UseGuards(AccessGuard)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {

        this.gasSlipService.setAuthUser(authUser)

        const can_print = await this.gasSlipService.canPrint(id)

        if(!can_print) {
            throw new UnauthorizedException("User is not allowed to print gas slip")
        }

        this.gasSlipPdfService.setAuthUser(authUser)

        try {

            // Increment the print count only after successful PDF generation
            await this.gasSlipPdfService.increment_print_count(id);

            const gasSlip = await this.gasSlipPdfService.findGasSlip(id);
            // @ts-ignore
            const pdfBuffer = await this.gasSlipPdfService.generatePdf(gasSlip);
        
            // @ts-ignore
            res.setHeader('Content-Type', 'application/pdf');
            // @ts-ignore
            res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
        
            // @ts-ignore
            res.send(pdfBuffer);
            
        } catch (error) {

            await this.gasSlipPdfService.decrement_print_count(id);

            throw new InternalServerErrorException("Failed to generate PDF");
        }

    }

}
