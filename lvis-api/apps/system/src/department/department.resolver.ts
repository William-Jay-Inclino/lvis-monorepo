import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from '../__common__/modules.enum';
import { RESOLVERS } from '../__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Department)
export class DepartmentResolver {

  private readonly logger = new Logger(DepartmentResolver.name);
  private filename = 'department.resolver.ts'

  constructor(private readonly departmentService: DepartmentService) { }

  @Mutation(() => Department)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DEPARTMENT, RESOLVERS.createDepartment)
  async createDepartment(
    @Args('input') createDepartmentInput: CreateDepartmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createDepartment,
        input: JSON.stringify(createDepartmentInput)
      })
      
      this.departmentService.setAuthUser(authUser)

      const x = await this.departmentService.create(createDepartmentInput);
      
      this.logger.log('Department created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating department', error)
    }
  }

  @Query(() => [Department])
  departments() {
    return this.departmentService.findAll();
  }

  @Query(() => Department)
  department(@Args('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Mutation(() => Department)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DEPARTMENT, RESOLVERS.updateDepartment)
  async updateDepartment(
    @Args('id') id: string,
    @Args('input') updateDepartmentInput: UpdateDepartmentInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateDepartment,
        department_id: id,
        input: JSON.stringify(updateDepartmentInput),
      })
      
      this.departmentService.setAuthUser(authUser)
      const x = await this.departmentService.update(id, updateDepartmentInput);

      this.logger.log('Department updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating department', error)
    }
  }

  @Mutation(() => SystemRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.DEPARTMENT, RESOLVERS.removeDepartment)
  async removeDepartment(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeDepartment,
        account_id: id,
      })

      this.departmentService.setAuthUser(authUser)
      const x = await this.departmentService.remove(id);
      
      this.logger.log('Department removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing department', error)
    }
  }


  @ResolveReference()
  async resolveReference(reference: { __typename: string, id: string }) {
    return await this.departmentService.findOne(reference.id)
  }

}
