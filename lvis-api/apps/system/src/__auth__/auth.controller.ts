import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CreateUserInput } from "../user/dto/create-user.input";
import { UserService } from "../user/user.service";
import { Role, User } from "apps/system/prisma/generated/client";
import { IpAddress } from "./ip-address.decorator";
import { UserAgent } from "./user-agent.decorator";
import { SystemAuditService } from "../system_audit/system_audit.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly audit: SystemAuditService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request): Promise<{ user: User, access_token: string }> {
        return this.authService.login(req.user as User);
    }

    @Post('create-admin')
    createAdmin(
        @Body() dto: { password: string },
        @UserAgent() user_agent: string,
        @IpAddress() ip_address: string,
    ): Promise<User> {

        const admin = {} as CreateUserInput
        admin.username = 'admin'
        admin.password = dto.password
        admin.role = Role.ADMIN

        return this.userService.create(admin, {
            ip_address,
            device_info: this.audit.getDeviceInfo(user_agent)
        })
    }

    @Get('health-check')
    test() {
        return 'system OK'
    }

}