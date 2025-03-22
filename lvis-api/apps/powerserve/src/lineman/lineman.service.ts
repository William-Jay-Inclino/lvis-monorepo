import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Lineman } from './entities/lineman.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class LinemanService {

    private readonly logger = new Logger(LinemanService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Lineman[]> {  

        try {
            
            const items = await this.prisma.lineman.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() lineman', error)            
        }

    }

    async findOne(id: string): Promise<Lineman | null> {
        
        try {
            
            const item = await this.prisma.lineman.findUnique({
                where: { id },
                include: {
                    area: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Lineman not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() lineman', error)
        }

    }

    async get_all_lineman_by_current_user(payload: { authUser: AuthUser }): Promise<Lineman[]> {

        const { authUser } = payload

        if(!authUser.user.user_employee) {
            return []
        }

        const employee = authUser.user.user_employee.employee

        const area = await this.prisma.area.findUnique({ where: { oic_id: employee.id } })

        // is area head
        if(area) {

            return await this.prisma.lineman.findMany({
                where: {
                    OR: [
                        { area_id: area.id },
                        { supervisor_id: employee.id }
                    ]
                } 
            })

        }

        return []

    }

}
