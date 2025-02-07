import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { Division } from './entities/division.entity';
import { CreateDivisionInput } from './dto/create-division.input';
import { UpdateDivisionInput } from './dto/update-division.input';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { SystemRemoveResponse } from '../__common__/classes';
import { DivisionService } from './division.service';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from '../__common__/modules.enum';
import { RESOLVERS } from '../__common__/resolvers.enum';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Division)
export class DivisionResolver {

  private readonly logger = new Logger(DivisionResolver.name);
  private filename = 'division.resolver.ts'

  constructor(
    private readonly divisionService: DivisionService,
    private readonly audit: SystemAuditService,
  ) { }

  @Mutation(() => Division)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DIVISION, RESOLVERS.createDivision)
  async createDivision(
    @Args('input') createDivisionInput: CreateDivisionInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Creating division...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createDivisionInput)
    })

    try {
      
      const x = await this.divisionService.create(createDivisionInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('Division created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating division', error)
    }


  }

  @Query(() => [Division])
  divisions() {
    return this.divisionService.findAll();
  }

  @Query(() => Division)
  division(@Args('id') id: string) {
    return this.divisionService.findOne(id);
  }

  @Mutation(() => Division)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DIVISION, RESOLVERS.updateDivision)
  async updateDivision(
    @Args('id') id: string,
    @Args('input') updateDivisionInput: UpdateDivisionInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating division...', {
      username: authUser.user.username,
      filename: this.filename,
      division_id: id,
      input: JSON.stringify(updateDivisionInput),
    })

    try {

      const x = await this.divisionService.update(id, updateDivisionInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });

      this.logger.log('Division updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating division', error)
    }
  }

  @Mutation(() => SystemRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DIVISION, RESOLVERS.removeDivision)
  async removeDivision(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing division...', {
      username: authUser.user.username,
      filename: this.filename,
      division_id: id,
    })

    try {

      const x = await this.divisionService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('Division removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing division', error)
    }
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string, id: string }) {
    return await this.divisionService.findOne(reference.id)
  }

}
