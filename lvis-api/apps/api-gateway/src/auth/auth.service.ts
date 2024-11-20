import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { USER_STATUS } from '../__common__/types';
import axios from 'axios';
import { UserLogEventType } from 'apps/system/prisma/generated/client';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) { }

    async validateUser(username: string, password: string): Promise<User> {

        console.log('AuthService: validateUser()', username, password)

        const user = await this.findByUserName(username)

        console.log('user', user)

        if (user && user.password === password) {

            if (user.status === USER_STATUS.INACTIVE) {
                throw new UnauthorizedException('User is Inactive')
            }

            if (user.deleted_at) {
                console.log('User is deleted at: ', user.deleted_at)
                throw new NotFoundException('User not found')
            }

            return user
        }

        throw new UnauthorizedException('Invalid credentials');

    }

    async login(user: User, ip_address: string, device_info: object): Promise<{ user: User, access_token: string }> {

        const payload = { username: user.username, sub: user.id };

        await this.audit_log(user.id, ip_address, device_info, UserLogEventType.LOGIN)

        return {
            user,
            access_token: this.jwtService.sign(payload),
        };

    }

    async audit_log(user_id: string, ip_address: string, device_info: object, event_type: UserLogEventType) {
        try {
            const res = await axios.post(`${ process.env.SYSTEM_API_URL }/user-audit-log`, {
                user_id,
                ip_address,
                device_info,
                event_type,  
            });

        } catch (error) {

            console.error('Error creating user audit log:', error);

        }
    }

    private async findByUserName(username: string): Promise<User> {
        const query = `
            query{
                getUserByUserName(username: "${username}") {
                    id
                    username
                    password
                    status
                    role
                    permissions
                    deleted_at
                    user_employee {
                        employee {
                            id
                            is_budget_officer
                            is_finance_manager
                            total_pending_approvals
                        }
                    }
                }
            }
        `;

        console.log('query', query)

        const { data } = await firstValueFrom(
            this.httpService.post(process.env.API_GATEWAY_URL, { query }).pipe(
                catchError((error) => {
                    throw error
                }),
            ),
        );

        console.log('data', data)

        if (!data || !data.data || !data.data.getUserByUserName) {
            throw new UnauthorizedException("Unauthorized User")
        }

        console.log('data.data.getUserByUserName', data.data.getUserByUserName)

        return data.data.getUserByUserName

    }

}
