import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { CanvassPdfService } from './canvass.pdf.service';
import { JwtAuthGuard } from '../__auth__/guards/jwt-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('canvass')
export class CanvassController {

    constructor(
        private readonly canvassPdfService: CanvassPdfService
    ) { }


    @Get('pdf/:id')
    @UseGuards(JwtAuthGuard, AccessGuard)
    @CheckAccess(MODULES.CANVASS, RESOLVERS.printCanvass)
    async generatePdf(
        @Param('id') id: string, 
        @Res() res: Response,
        @CurrentAuthUser() authUser: AuthUser
    ) {
        this.canvassPdfService.setAuthUser(authUser)

        const canvass = await this.canvassPdfService.findCanvass(id)
        // @ts-ignore
        const pdfBuffer = await this.canvassPdfService.generatePdf(canvass)

        // Set response headers
        // @ts-ignore
        res.setHeader('Content-Type', 'application/pdf');
        // @ts-ignore
        res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');

        // Send PDF buffer to client
        // @ts-ignore
        res.send(pdfBuffer);

    }

    @Get('health-check')
    test() {
        return 'warehouse OK'
    }

}
