import { Int, Query, Resolver } from '@nestjs/graphql';
import { SettingService } from './setting.service';
import { Logger } from '@nestjs/common';
import { SETTINGS } from '../__common__/constants';

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

	@Query(() => Int)
	minimum_no_of_supplier_in_meqs() {
	  try {
		
		return this.settingService.get_min_or_max_supplier_in_meqs(SETTINGS.MIN_SUPPLIER_IN_MEQS);
  
	  } catch (error) {
		this.logger.error("Error in getting minimum_no_of_supplier_in_meqs", error)
	  }
	}

	@Query(() => Int)
	maximum_no_of_supplier_in_meqs() {
	  try {
		
		return this.settingService.get_min_or_max_supplier_in_meqs(SETTINGS.MAX_SUPPLIER_IN_MEQS);
  
	  } catch (error) {
		this.logger.error("Error in getting maximum_no_of_supplier_in_meqs", error)
	  }
	}

}
