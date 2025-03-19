import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { Area } from 'apps/powerserve/prisma/generated/client';

@Injectable()
export class AreaService {

    private readonly logger = new Logger(AreaService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<Area[]> {  

        try {
            
            const items = await this.prisma.area.findMany({
                include: {
                    municipalities: {
                        include: {
                            barangays: {
                                include: {
                                    sitios: true
                                }
                            }
                        }
                    },
                    linemen: true
                }
            })
            return items

        } catch (error) {
            this.logger.error('Error in findAll() area', error)            
        }

    }

    async findOne(id: string): Promise<Area | null> {
        
        try {
            
            const item = await this.prisma.area.findUnique({
                where: { id },
                include: {
                    linemen: true,
                    municipalities: true,
                }
            })
    
            if (!item) {
                throw new NotFoundException('Area not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() area', error)
        }

    }


    async get_total_municipalities(payload: { area_id: string }): Promise<number> {

        const { area_id } = payload

        return await this.prisma.municipality.count({ where: { area_id } })

    }

    async get_total_barangays(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.barangay.count({
          where: {
            municipality: {
              area_id: area_id,
            },
          },
        });
    }

    async get_total_sitios(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.sitio.count({
          where: {
            barangay: {
              municipality: {
                area_id: area_id,
              },
            },
          },
        });
    }

    async get_total_lineman(payload: { area_id: string }): Promise<number> {
        const { area_id } = payload;
      
        return await this.prisma.lineman.count({
          where: {
            area_id
          },
        });
    }
      

}
