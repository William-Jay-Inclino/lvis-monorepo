import { Controller, UseGuards, Post, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './entities/user.entity';
import * as DeviceDetector from 'device-detector-js';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request) {
        console.log('logging in')

        const ip_address = req.socket.remoteAddress || req.ip;
        const deviceInfo = this.getDeviceInfo(req);

        console.log('User login attempt from IP:', ip_address);
        console.log('Device Info:', deviceInfo);

        return this.authService.login(req.user as User, ip_address, deviceInfo);
    }

    private getDeviceInfo(req: Request) {
        const userAgent = req.headers['user-agent'] || '';
        
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);
      
        return {
            browser: device.client?.name || 'Unknown Browser',
            browserVersion: device.client?.version || 'Unknown Version',
            os: device.os?.name || 'Unknown OS',
            osVersion: device.os?.version || 'N/A',  
            device: device.device?.type || 'Unknown Device',
            deviceModel: device.device?.model || 'Unknown',  
        };
    }

    @Get('test-get')
    test_get(@Req() req: Request) {
        return 'hello'
    }

    @Post('test-post')
    test_post(@Req() req: Request) {
        return 'hello'
    }

}
