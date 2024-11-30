import { Controller, Get, Logger, Param } from "@nestjs/common";
import { EmployeeService } from "./employee.service";

@Controller('employee')
export class EmployeeController {

    private readonly logger = new Logger(EmployeeController.name);

    constructor(
        private readonly employeeService: EmployeeService,
    ) { }

    @Get(':employee_id/get-total-notifications')
    async get_total_notifications(
        @Param('employee_id') employee_id: string,
    ): Promise<number> {

        try {
            
            const total_pendings = await this.employeeService.get_total_pendings(employee_id)

            return total_pendings

        } catch (error) {
            this.logger.error('Error in getting total notifications of Employee', error)
        }



    }

}