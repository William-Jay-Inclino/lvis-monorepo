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

}