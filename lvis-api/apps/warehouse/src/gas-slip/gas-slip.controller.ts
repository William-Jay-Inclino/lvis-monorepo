import { Controller, Get, InternalServerErrorException, Logger, Param, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GasSlipPdfService } from './gas-slip.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { GasSlipService } from './gas-slip.service';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

@UseGuards(JwtAuthGuard)
@Controller('gas-slip')
export class GasSlipController {

    private readonly logger = new Logger(GasSlipController.name);
    private filename = 'gas-slip.controller.ts'

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

        try {
            this.logger.log({
                username: authUser.user.username,
                filename: this.filename,
                function: RESOLVERS.printGasSlip,
                gas_slip_id: id
            })

            this.gasSlipService.setAuthUser(authUser)
    
            const can_print = await this.gasSlipService.canPrint(id)
    
            if(!can_print) {
                throw new UnauthorizedException("User is not allowed to print gas slip")
            }
    
            this.gasSlipPdfService.setAuthUser(authUser)

            // Increment the print count only after successful PDF generation
            await this.gasSlipPdfService.increment_print_count(id);

            const gasSlip = await this.gasSlipPdfService.findGasSlip(id);
            // @ts-ignore
            const pdfBuffer = await this.gasSlipPdfService.generatePdf(gasSlip);
        
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=gas_slip.pdf',
            });

            // @ts-ignore
            res.send(pdfBuffer);
            
        } catch (error) {

            await this.gasSlipPdfService.decrement_print_count(id);

            this.logger.error(`Failed to generate PDF: gas-slip`, error)
            // @ts-ignore
            res.status(500).json({ message: 'Failed to generate gas slip PDF', error: error.message });
        }

    }

}
