import { Injectable } from "@nestjs/common";
import { AuthUser } from "apps/system/src/__common__/auth-user.entity";
import { PrismaService } from "../__prisma__/prisma.service";

@Injectable()
export class VehicleMaintenanceService {

    private authUser: AuthUser

    constructor(private readonly prisma: PrismaService) {}

    setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

}