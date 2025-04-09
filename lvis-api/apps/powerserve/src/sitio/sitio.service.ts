import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { CreateSitioInput } from './dto/create-sitio.input';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from '@prisma/client';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { Sitio } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class SitioService {

    private readonly logger = new Logger(SitioService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: PowerserveAuditService,
    ) { }

    async create(
        input: CreateSitioInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
    ): Promise<Sitio> {

        const authUser = metadata.authUser

        const existingSitio = await this.prisma.sitio.findFirst({
            where: { name: input.name, barangay_id: input.barangay_id },
        });
    
        if (existingSitio) {
            throw new Error('Sitio already exist');
        }
        
        return await this.prisma.$transaction(async(tx) => {

            const created = await tx.sitio.create({
                data: {
                    barangay: { connect: { id: input.barangay_id } },
                    name: input.name
                },
                include: {
                    barangay: {
                        include: {
                            municipality: true
                        }
                    }
                }
            })

			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.SITIO,
				action: 'CREATE-SITIO',
				reference_id: created.id,
				metadata: created,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, tx as unknown as Prisma.TransactionClient)
    
            return created

        })


    }

    async findAll(): Promise<Sitio[]> {  

        try {
            
            const items = await this.prisma.sitio.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() sitio', error)            
        }

    }

    async findOne(id: string): Promise<Sitio | null> {
        
        try {
            
            const item = await this.prisma.sitio.findUnique({
                where: { id },
                include: {
                    barangay: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Sitio not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() sitio', error)
        }

    }

}
