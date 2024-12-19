import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';
import { VehicleMaintenance } from './entities/vehicle-maintenance.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { CreateVehicleMaintenanceInput } from './dto/create-vehicle-maintenance.input';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
@Resolver( () => VehicleMaintenance)
export class VehicleMaintenanceResolver {

	private readonly logger = new Logger(VehicleMaintenanceResolver.name);
	private filename = 'vehicle-maintenance.resolver.ts'

	constructor(private readonly vehicleMaintenanceService: VehicleMaintenanceService) {}

	@Mutation(() => VehicleMaintenance)
	@UseGuards(AccessGuard)
	@CheckAccess(MODULES.VEHICLE, RESOLVERS.createVehicleMaintenance)
	async createVehicleMaintenance(
		@Args('input') input: CreateVehicleMaintenanceInput,
		@CurrentAuthUser() authUser: AuthUser
	) {
		try {
			this.logger.log({
				username: authUser.user.username,
				filename: this.filename,
				function: RESOLVERS.createVehicleMaintenance,
				input: JSON.stringify(input)
			})
			
			this.vehicleMaintenanceService.setAuthUser(authUser)
	
			const x = await this.vehicleMaintenanceService.create(input);
			
			this.logger.log('Vehicle Maintenance created successfully')
	
			return x
	
		} catch (error) {
			this.logger.error('Error in creating Vehicle Maintenance', error)
		}
	}

}
