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

@UseGuards(GqlAuthGuard)
@Resolver(() => Division)
export class DivisionResolver {

  private readonly logger = new Logger(DivisionResolver.name);
  private filename = 'division.resolver.ts'

  constructor(private readonly divisionService: DivisionService) { }

  @Mutation(() => Division)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DIVISION, RESOLVERS.createDivision)
  async createDivision(
    @Args('input') createDivisionInput: CreateDivisionInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createDivision,
        input: JSON.stringify(createDivisionInput)
      })
      
      this.divisionService.setAuthUser(authUser)

      const x = await this.divisionService.create(createDivisionInput);
      
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
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateDivision,
        division_id: id,
        input: JSON.stringify(updateDivisionInput),
      })
      
      this.divisionService.setAuthUser(authUser)
      const x = await this.divisionService.update(id, updateDivisionInput);

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
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeDivision,
        division_id: id,
      })

      this.divisionService.setAuthUser(authUser)
      const x = await this.divisionService.remove(id);
      
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
