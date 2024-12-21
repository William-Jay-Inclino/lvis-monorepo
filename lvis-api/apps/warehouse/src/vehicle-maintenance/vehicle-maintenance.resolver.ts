import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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
import { VehicleMaintenanceResponse } from './entities/vehicles-response.entity';
import { UpdateVehicleMaintenanceInput } from './dto/update-vehicle-maintenance.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { UpdateCompletionResponse } from './entities/update-completion-response';
import { UpdateVehicleMaintenanceCompletionInput } from './dto/update-vehicle-maintenance-completion.input';

@UseGuards(GqlAuthGuard)
@Resolver( () => VehicleMaintenance)
export class VehicleMaintenanceResolver {

	private readonly logger = new Logger(VehicleMaintenanceResolver.name);
	private filename = 'vehicle-maintenance.resolver.ts'

	constructor(private readonly vehicleMaintenanceService: VehicleMaintenanceService) {}

	@Mutation(() => VehicleMaintenance)
	@UseGuards(AccessGuard)
	@CheckAccess(MODULES.VEHICLE_MAINTENANCE, RESOLVERS.createVehicleMaintenance)
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

	@Mutation(() => UpdateCompletionResponse)
	@UseGuards(AccessGuard)
	@CheckAccess(MODULES.VEHICLE_MAINTENANCE, RESOLVERS.updateVehicleMaintenance)
	async updateVehicleMaintenanceCompletion(
		@Args('input') input: UpdateVehicleMaintenanceCompletionInput,
		@CurrentAuthUser() authUser: AuthUser
	) {
		try {
			this.logger.log({
				username: authUser.user.username,
				filename: this.filename,
				function: 'updateVehicleMaintenanceCompletion',
				input: JSON.stringify(input)
			})
			
			this.vehicleMaintenanceService.setAuthUser(authUser)
	
			const x = await this.vehicleMaintenanceService.update_field_is_completed(input.vehicle_maintenance_id, input.is_completed);
			
			this.logger.log(`Updated Vehicle Maintenance completion. Value: ${input.is_completed} `)
	
			return x
	
		} catch (error) {
			this.logger.error('Error in updating Vehicle Maintenance field: is_completed', error)
		}
	}

	@Query(() => VehicleMaintenanceResponse)
	vehicle_maintenances(
		@Args('page') page: number,
		@Args('pageSize') pageSize: number,
		@Args('vehicle_id', { nullable: true }) vehicle_id?: string,
		@Args('service_center_id', { nullable: true }) service_center_id?: string,
		@Args('service_date', { nullable: true }) service_date?: string,
	) {

		try {
			return this.vehicleMaintenanceService.findAll(page, pageSize, vehicle_id, service_center_id, service_date);
		} catch (error) {
			this.logger.error('Error in getting all Vehicle Maintenance', error)
		}

	}

	@Query(() => VehicleMaintenance)
	async vehicle_maintenance(
	  	@Args('id', { nullable: true }) id?: string,
	  	@Args('ref_number', { nullable: true }) ref_number?: string
	) {

		try {
			if (id) {
				return this.vehicleMaintenanceService.findBy({id});
			}
			if (ref_number) {
				return this.vehicleMaintenanceService.findBy({ref_number})
			}

		} catch (error) {
			this.logger.error('Error in getting vehicle', error)
		}

	}

	@Query(() => [VehicleMaintenance])
    vehicle_maintenances_by_ref_number(
        @Args('ref_number') ref_number: string,
        @Args('is_detail_included', { nullable: true }) is_detail_included?: boolean,
    ){
        return this.vehicleMaintenanceService.findRefNumbersByInput(ref_number, is_detail_included);
    }

	@Query(() => [VehicleMaintenance])
    maintenance_schedule(
		@Args('startDate', { type: () => String }) startDate: string,
		@Args('endDate', { type: () => String }) endDate: string,
	){

		const start = new Date(startDate);
		const end = new Date(endDate);

        return this.vehicleMaintenanceService.get_maintenance_schedule({ start, end });
    }

	@Mutation(() => VehicleMaintenance)
	@UseGuards(AccessGuard)
	@CheckAccess(MODULES.VEHICLE_MAINTENANCE, RESOLVERS.updateVehicleMaintenance)
	async updateVehicleMaintenance(
	  @Args('id') id: string,
	  @Args('input') input: UpdateVehicleMaintenanceInput,
	  @CurrentAuthUser() authUser: AuthUser
	) {
		try {
			this.logger.log({
				username: authUser.user.username,
				filename: this.filename,
				function: RESOLVERS.updateVehicleMaintenance,
				vehicle_maintenance_id: id,
				input: JSON.stringify(input),
			})
			
			this.vehicleMaintenanceService.setAuthUser(authUser)
			const x = await this.vehicleMaintenanceService.update(id, input);
	
			this.logger.log('Vehicle Maintenance updated successfully')
	
			return x
		} catch (error) {
			this.logger.error('Error in updating Vehicle Maintenance', error)
		}
	}

	@Mutation(() => WarehouseRemoveResponse)
	@UseGuards(AccessGuard)
	@CheckAccess(MODULES.VEHICLE_MAINTENANCE, RESOLVERS.removeVehicleMaintenance)
	async removeVehicleMaintenance(
	  @Args('id') id: string,
	  @CurrentAuthUser() authUser: AuthUser
	) {
	  try {
  
		this.logger.log({
		  username: authUser.user.username,
		  filename: this.filename,
		  function: RESOLVERS.removeVehicleMaintenance,
		  vehicle_maintenance_id: id,
		})
  
		this.vehicleMaintenanceService.setAuthUser(authUser)
		const x = await this.vehicleMaintenanceService.remove(id);
		
		this.logger.log('Vehicle Maintenance removed successfully')
		
		return x 
  
	  } catch (error) {
		this.logger.error('Error in removing Vehicle Maintenance', error)
	  }
	}

}
