import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import { WeatherCondition } from './entities/weather_condition.entity';

@Injectable()
export class WeatherConditionService {

    private readonly logger = new Logger(WeatherConditionService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(): Promise<WeatherCondition[]> {  

        try {
            
            const items = await this.prisma.weatherCondition.findMany()
            return items

        } catch (error) {
            this.logger.error('Error in findAll() weather_condition', error)            
        }

    }

    async findOne(id: string): Promise<WeatherCondition | null> {
        
        try {
            
            const item = await this.prisma.weatherCondition.findUnique({
                where: { id },
            })
    
            if (!item) {
                throw new NotFoundException('WeatherCondition not found with id: ', id)
            }
    
            return item

        } catch (error) {
            this.logger.error('Error in findOne() weather_condition', error)
        }

    }

}
