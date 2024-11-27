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

@UseGuards(GqlAuthGuard)
@Resolver(() => Division)
export class DivisionResolver {

  private readonly logger = new Logger(DivisionResolver.name);
  private filename = 'division.resolver.ts'

  constructor(private readonly divisionService: DivisionService) { }

  @Mutation(() => Division)
  async createDivision(
    @Args('input') createDivisionInput: CreateDivisionInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    const log_info = `User: ${authUser.user.username} | File: ${this.filename} | Resolver: createDivision`

    try {
      
      this.logger.log(log_info, JSON.stringify(createDivisionInput))
  
      this.divisionService.setAuthUser(authUser)
      return await this.divisionService.create(createDivisionInput);
  
    } catch (error) {
      this.logger.error(log_info, error)
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
  updateDivision(
    @Args('id') id: string,
    @Args('input') updateDivisionInput: UpdateDivisionInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.divisionService.setAuthUser(authUser)
    return this.divisionService.update(id, updateDivisionInput);
  }

  @Mutation(() => SystemRemoveResponse)
  removeDivision(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.divisionService.setAuthUser(authUser)
    return this.divisionService.remove(id);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string, id: string }) {
    return await this.divisionService.findOne(reference.id)
  }

}
