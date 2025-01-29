import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { USER_STATUS } from '../__common__/types';
import axios from 'axios';
import { UserLogEventType } from 'apps/system/prisma/generated/client';
import { decrypt_password } from '../__common__/helpers';

@Injectable()
export class AuthService {

    private readonly secretKey = process.env.CRYPTO_SECRET_KEY;

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<User> {

        const user = await this.getUserByUsername(username);

        if (user) {
            const decryptedPassword = decrypt_password(user.password, this.secretKey);

            if (decryptedPassword === password) {
                if (user.status === USER_STATUS.INACTIVE) {
                    throw new UnauthorizedException('User is Inactive');
                }
    
                return user;
            }
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
            throw new Error(`Error creating user audit log: ${error}`)

        }
    }

    async getUserByUsername(username: string): Promise<User> {
        try {
          const response = await axios.get(`${process.env.SYSTEM_API_URL}/user/get-user-by-username/${username}`);
          return response.data
        } catch (error) {
            throw new Error(`Error in getting user: ${ error }`)
        }
      }

}
