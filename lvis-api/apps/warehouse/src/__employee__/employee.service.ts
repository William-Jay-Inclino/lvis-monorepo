import { Injectable } from "@nestjs/common";
import { PrismaService } from "../__prisma__/prisma.service";
import { Pending } from "apps/warehouse/prisma/generated/client";


@Injectable()
export class EmployeeService {
    
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async get_total_pendings(employee_id: string): Promise<number> {

        return await this.prisma.pending.count({
            where: {
                approver_id: employee_id
            }
        })

    }

    async get_all_pendings(employee_id: string): Promise<Pending[]> {
        
        return await this.prisma.pending.findMany({
            where: {
                approver_id: employee_id
            },
            orderBy: {
                transaction_date: 'asc'
            }
        })

    }

}