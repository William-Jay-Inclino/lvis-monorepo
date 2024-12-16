import { Injectable, Logger } from "@nestjs/common";
import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import { PrismaService } from "../__prisma__/prisma.service";
import { CreateVehicleMaintenanceInput } from "./dto/create-vehicle-maintenance.input";
import { Prisma, VehicleMaintenance } from "apps/warehouse/prisma/generated/client";

@Injectable()
export class VehicleMaintenanceService {

    private authUser: AuthUser
    private readonly logger = new Logger(VehicleMaintenanceService.name);

    constructor(private readonly prisma: PrismaService) {}

    setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

    async create(input: CreateVehicleMaintenanceInput): Promise<VehicleMaintenance> {

        try {
            
            const refNumber = await this.getLatestRefNumber()
    
            const data: Prisma.VehicleMaintenanceCreateInput = {
                ref_number: refNumber,
                vehicle: {
                    connect: { id: input.vehicle_id }
                },
                service_center: {
                    connect: {
                        id: input.service_center_id
                    }
                },
                service_date: new Date(input.service_date),
                service_mileage: input.service_mileage,
                next_service_date: new Date(input.next_service_date),
                next_service_mileage: input.next_service_mileage,
                cost: input.cost,
                remarks: input.remarks,
                performed_by: input.performed_by,
                created_by: this.authUser.user.username,
                services: {
                    create: input.services.map(i => {
                        return {
                            service_id: i.service_id,
                            note: i.note,
                        }
                    })
                }
            }
    
            const created = await this.prisma.vehicleMaintenance.create({
                data
            })
    
            return created

        } catch (error) {
            this.logger.error('Error in creating vehicle maintenance', error)
        }

	}

    private async getLatestRefNumber(): Promise<string> {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        const latestItem = await this.prisma.vehicleMaintenance.findFirst({
            where: { ref_number: { startsWith: currentYear } },
            orderBy: { ref_number: 'desc' },
        });

        if (latestItem) {
            const latestNumericPart = parseInt(latestItem.ref_number.slice(-5), 10);
            const newNumericPart = latestNumericPart + 1;
            const newRcNumber = `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
            return newRcNumber;
        } else {
            // If no existing rc_number with the current year prefix, start with '00001'
            return `${currentYear}-00001`;
        }
    }

}