import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
// import { RvApproverService } from './rv-approver.service';
import { RVApprover } from './entities/rv-approver.entity';
// import { CreateRvApproverInput } from './dto/create-rv-approver.input';
// import { UpdateRvApproverInput } from './dto/update-rv-approver.input';
// import { WarehouseRemoveResponse } from '../__common__/classes';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
// import { AuthUser } from '../__common__/auth-user.entity';
// import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { Employee } from '../__employee__/entities/employee.entity';
// import { UpdateRVOrderResponse } from './entities/update-rv-order-response.entity';
// import { UpdateRVOrderInput } from './dto/update-rv-order.input'
// import { isAdmin } from '../__common__/helpers';

@UseGuards(GqlAuthGuard)
@Resolver(() => RVApprover)
export class RvApproverResolver {
//   constructor() { }

//   @Mutation(() => RVApprover)
//   createRvApprover(
//     @Args('input') createRvApproverInput: CreateRvApproverInput,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can create RV Approver')
//     }

//     this.rvApproverService.setAuthUser(authUser)
//     return this.rvApproverService.create(createRvApproverInput);
//   }

//   @Query(() => [RVApprover])
//   rv_approvers(
//     @Args('rv_id', { nullable: true }) rv_id?: string,
//     @Args('rv_number', { nullable: true }) rv_number?: string,
//   ) {
//     if (rv_id) {
//       return this.rvApproverService.findByRvId(rv_id)
//     }
//     if (rv_number) {
//       return this.rvApproverService.findByRvNumber(rv_number)
//     }
//   }

//   @Query(() => RVApprover)
//   rv_approver(@Args('id') id: string) {
//     return this.rvApproverService.findOne(id);
//   }

//   @Mutation(() => RVApprover)
//   updateRvApprover(
//     @Args('id') id: string,
//     @Args('input') updateRvApproverInput: UpdateRvApproverInput,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {
//     this.rvApproverService.setAuthUser(authUser)
//     return this.rvApproverService.update(id, updateRvApproverInput);
//   }

//   @Mutation(() => UpdateRVOrderResponse)
//   async updateRVApproverOrder(
//     @Args('inputs', { type: () => [UpdateRVOrderInput] }) inputs: UpdateRVOrderInput[],
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can update RV Approver Order')
//     }

//     return await this.rvApproverService.updateManyOrders(inputs);

//   }

//   @Mutation(() => WarehouseRemoveResponse)
//   removeRvApprover(
//     @Args('id') id: string,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can remove RV Approver')
//     }

//     this.rvApproverService.setAuthUser(authUser)
//     return this.rvApproverService.remove(id);
//   }

  @ResolveField(() => Employee)
  approver(@Parent() rvApprover: RVApprover): any {
    console.log('rvApprover', rvApprover);
    return { __typename: 'Employee', id: rvApprover.approver_id }
  }

}
