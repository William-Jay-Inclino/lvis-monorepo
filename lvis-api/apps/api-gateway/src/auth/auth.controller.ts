import { Controller, UseGuards, Post, Req, Get, Body, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './entities/user.entity';
import * as DeviceDetector from 'device-detector-js';
import { UserLogEventType } from 'apps/system/prisma/generated/client';
import { normalizeIp } from '../__common__/helpers';

@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
  private filename = 'auth.controller.ts'

    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request) {

        // @ts-ignore
        const username = req.user.username
        const ip_address = req.socket.remoteAddress || req.ip;
        const device_info = this.getDeviceInfo(req);

        try {

            this.logger.log({
                username,
                ip_address: normalizeIp(ip_address),
                device_info,
                filename: this.filename,
                function: 'login'
            })

            return await this.authService.login(req.user as User, ip_address, device_info);

        } catch (error) {
            this.logger.error('Error in login', error)
        }

    }

    @Post('logout')
    async logout(@Req() req: Request, @Body('user_id') user_id: string) {

        const ip_address = req.socket.remoteAddress || req.ip;
        const device_info = this.getDeviceInfo(req);

        try {

            this.logger.log({
                user_id,
                ip_address: normalizeIp(ip_address),
                device_info,
                filename: this.filename,
                function: 'logout'
            })

            return await this.authService.audit_log(user_id, ip_address, device_info, UserLogEventType.LOGOUT)
            
        } catch (error) {
            this.logger.error('Error in logout', error)
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

    @Get('health-check')
    test() {
        return 'api-gateway OK'
    }

    // @Post('test-post')
    // test_post(@Req() req: Request) {
    //     return 'hello'
    // }

}
