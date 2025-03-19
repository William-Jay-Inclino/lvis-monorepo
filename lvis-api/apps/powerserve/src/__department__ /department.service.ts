import { HttpService } from '@nestjs/axios';
import { Injectable} from '@nestjs/common';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class DepartmentService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    async get_department(payload: { id: string, authUser: AuthUser }) {

        const { id, authUser } = payload

        const query = `
            query {
                department(id: "${ id }") {
                    id 
                    name
                }
            }
        `;

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
                    process.env.API_GATEWAY_URL,
                    { query },
                    {
                        headers: {
                            Authorization: authUser.authorization,
                            'Content-Type': 'application/json',
                        },
                    }
                ).pipe(
                    catchError((error) => {
                        throw error;
                    }),
                ),
            );

            if (!data || !data.data) {
                return undefined;
            }

            return data.data.department;

        } catch (error) {
            return undefined;
        }
    }


}
