import { Query } from '@nestjs/graphql';
import { SettingService } from './setting.service';
import { Employee } from '../employee/entities/employee.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AuthUser } from '../__common__/auth-user.entity';

@UseGuards(GqlAuthGuard)
export class SettingResolver {

  private readonly logger = new Logger(SettingResolver.name);
  private filename = 'setting.resolver.ts'

  constructor(private readonly settingService: SettingService) {}

  @Query(() => Employee)
  general_manager(@CurrentAuthUser() authUser: AuthUser) {

    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'general_manager',
      })
      
      return this.settingService.findGM();

    } catch (error) {
      this.logger.error("Error in getting general_manager", error)
    }

  }

  @Query(() => Employee)
  warehouse_custodian(@CurrentAuthUser() authUser: AuthUser) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'warehouse_custodian',
      })
      
      return this.settingService.findWarehouseCustodian();

    } catch (error) {
      this.logger.error("Error in getting warehouse_custodian", error)
    }
  }

  @Query(() => Employee)
  fmsd_chief(@CurrentAuthUser() authUser: AuthUser) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: 'fmsd_chief',
      })
      
      return this.settingService.findFMSDChief();

    } catch (error) {
      this.logger.error("Error in getting fmsd_chief", error)
    }
  }

}
