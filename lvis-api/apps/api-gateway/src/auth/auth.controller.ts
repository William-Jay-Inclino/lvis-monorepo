import { Controller, UseGuards, Post, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './entities/user.entity';
import * as DeviceDetector from 'device-detector-js';
import axios from 'axios';

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

        return this.authService.login(req.user as User, ip_address, deviceInfo);
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request) {
        console.log('logging out')

        const user = req.user as User
        const ip_address = req.socket.remoteAddress || req.ip;
        const deviceInfo = this.getDeviceInfo(req);

        try {
            await axios.post(`${ process.env.SYSTEM_API_URL }/user-audit-log`, {
                user_id: user.id,
                ip_address: ip_address,
                device_info: deviceInfo,
                event_type: 'LOGOUT',  
            });

            console.log('User audit log successfully created - LOGOUT');

        } catch (error) {

            console.error('Error creating user audit log:', error);

        }
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
