import { Int, Query, Resolver } from '@nestjs/graphql';
import { SettingService } from './setting.service';
import { Logger } from '@nestjs/common';

@Resolver()
export class SettingResolver {

	private readonly logger = new Logger(SettingResolver.name);
	
	constructor(private readonly settingService: SettingService) {}

	@Query(() => Int)
	async osriv_expiration() {

		try {
		  
		  return await this.settingService.get_osriv_expiration()
	
		} catch (error) {
		  this.logger.error("Error in getting osriv_expiration", error)
		}
	
	}

	@Query(() => Int)
	async seriv_expiration() {

		try {
		  
		  return await this.settingService.get_seriv_expiration()
	
		} catch (error) {
		  this.logger.error("Error in getting seriv_expiration", error)
		}
	
	}

	@Query(() => Int)
	async mrv_expiration() {

		try {
		  
		  return await this.settingService.get_mrv_expiration()
	
		} catch (error) {
		  this.logger.error("Error in getting mrv_expiration", error)
		}
	
	}

}
