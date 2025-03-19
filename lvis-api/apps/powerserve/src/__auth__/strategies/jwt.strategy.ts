import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'apps/system/src/user/entities/user.entity';
import { ExtractJwt, Strategy } from "passport-jwt";
import { catchError, firstValueFrom } from 'rxjs';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        private readonly httpService: HttpService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }

    async validate(validationPayload: { username: string, sub: string }): Promise<User | null> {

        const query = `
            query{
                validateUserId(id: "${validationPayload.sub}") {
                    id
                    username
                    role
                    status
                    permissions
                    user_employee {
                        employee {
                            id 
                            is_budget_officer
                            is_finance_manager
                            department_id
                            division_id
                        }
                    }
                }
            }
        `;

        const { data } = await firstValueFrom(
            this.httpService.post(process.env.API_GATEWAY_URL, { query }).pipe(
                catchError((error) => {
                    throw error
                }),
            ),
        );

        if (!data || !data.data || !data.data.validateUserId) {
            throw new UnauthorizedException("Unauthorized User")
        }

        return data.data.validateUserId
    }
}