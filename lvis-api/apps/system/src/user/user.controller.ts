import { Controller, Get, NotFoundException, Param} from "@nestjs/common";
import { User } from "apps/system/prisma/generated/client";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('get-user-by-username/:username')
    async getUserByUsername(@Param('username') username: string): Promise<User> {
      const user = await this.userService.findByUserName(username);
      
      if (!user) {
        throw new NotFoundException(`User with username '${username}' not found`);
      }
      
      return user;
    }

	@Get('get-user-by-employee-id/:id')
    async getUserByEmployeeId(@Param('id') employee_id: string) {
      const user = await this.userService.findByEmployeeId(employee_id);
      
      if (!user) {
        throw new NotFoundException(`User with employee_id '${employee_id}' not found`);
      }
      
      return user;
    }

	@Get('get-usernames-by-division-id/:id')
    async getUsernamesByDivisionId(@Param('id') division_id: string) {
      const users = await this.userService.findUsernamesBy({ division_id });
      
      return users
    }

	@Get('get-usernames-by-department-id/:id')
    async getUsernamesByDepartmentId(@Param('id') department_id: string) {
      const users = await this.userService.findUsernamesBy({ department_id });
      
      return users
    }

}