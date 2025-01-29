import { Resolver, Query, Mutation, Args, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { SystemRemoveResponse } from '../__common__/classes';
import { EmployeesResponse } from './entities/employees-response.entity';
import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { MODULES } from '../__common__/modules.enum';
import { RESOLVERS } from '../__common__/resolvers.enum';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { USER_GROUP } from '../__common__/constants';
import { EmployeeMutationResponse } from './entities/employee-mutation-response.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Employee)
export class EmployeeResolver {

  private readonly logger = new Logger(EmployeeResolver.name);
  private filename = 'employee.resolver.ts'

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly audit: SystemAuditService,
  ) { }

  @Mutation(() => EmployeeMutationResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.EMPLOYEE, RESOLVERS.createEmployee)
  async createEmployee(
    @Args('input') createEmployeeInput: CreateEmployeeInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Creating employee...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createEmployeeInput)
    })

    try {
      
      this.employeeService.setAuthUser(authUser)

      const x = await this.employeeService.create(createEmployeeInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log(x.msg)

      return x

    } catch (error) {
      this.logger.error('Error in creating employee', error)
    }
  }

  @Query(() => EmployeesResponse)
  employees(
    @Args('page', { type: () => Number, nullable: true }) page: number = 1,
    @Args('pageSize', { type: () => Number, nullable: true }) pageSize: number = 10,
    @Args('searchBy', { type: () => String, nullable: true }) searchBy: 'name' | 'employee_number' = 'name',
    @Args('searchValue', { nullable: true }) searchValue?: string,
  ) {
    return this.employeeService.findAll(page, pageSize, searchBy, searchValue);
  }

  @Query(() => [Employee])
  budget_officers() {
    return this.employeeService.findAllEmployeesByUserGroup(USER_GROUP.BUDGET_OFFICER);
  }

  @Query(() => [Employee])
  finance_managers() {
    return this.employeeService.findAllEmployeesByUserGroup(USER_GROUP.FINANCE_MANAGER);
  }

  @Query(() => [Employee])
  auditors() {
    return this.employeeService.findAllEmployeesByUserGroup(USER_GROUP.AUDITOR);
  }

  @Query(() => [Employee])
  department_heads() {
    return this.employeeService.find_employees_by_user_group(USER_GROUP.DEPARTMENT_HEAD);
  }

  @Query(() => [Employee])
  employeesByName(
    @Args('name') name: string,
  ) {
    return this.employeeService.findEmployeesByName(name);
  }

  @Query(() => Employee)
  employee(@Args('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Mutation(() => EmployeeMutationResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.EMPLOYEE, RESOLVERS.updateEmployee)
  async updateEmployee(
    @Args('id') id: string,
    @Args('input') updateEmployeeInput: UpdateEmployeeInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    try {
      
      this.logger.log('Updating employee...', {
        username: authUser.user.username,
        filename: this.filename,
        employee_id: id,
        input: JSON.stringify(updateEmployeeInput),
      })
      
      this.employeeService.setAuthUser(authUser)
      const x = await this.employeeService.update(id, updateEmployeeInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });

      this.logger.log(x.msg)

      return x
    } catch (error) {
      this.logger.error('Error in updating employee', error)
    }
  }

  @Mutation(() => SystemRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.EMPLOYEE, RESOLVERS.removeEmployee)
  async removeEmployee(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Removing employee...', {
      username: authUser.user.username,
      filename: this.filename,
      function: RESOLVERS.removeEmployee,
      employee_id: id,
    })

    try {
      this.employeeService.setAuthUser(authUser)
      const x = await this.employeeService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent)
      });
      
      this.logger.log('Employee removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing employee', error)
    }
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string, id?: string, ids?: string[] }) {

    if (reference.__typename === 'Employee') {
      return await this.employeeService.findOne(reference.id)
    }

    if (reference.__typename === 'Employees') {
      return await this.employeeService.findByIds(reference.ids)
    }

  }

  @Query(() => Boolean)
  async validateEmployeeIds(@Args('ids', { type: () => [String] }) ids: string[]): Promise<boolean> {
    return this.employeeService.validateEmployeeIds(ids);
  }

  @ResolveField(() => Boolean)
  is_budget_officer(@Parent() employee: Employee) {
    return this.employeeService.is_budget_officer(employee.id)
  }

  @ResolveField(() => Boolean)
  is_finance_manager(@Parent() employee: Employee) {
    return this.employeeService.is_finance_manager(employee.id)
  }

}
