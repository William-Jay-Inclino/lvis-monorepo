import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
// import { MeqsApproverService } from './meqs-approver.service';
import { MEQSApprover } from './entities/meqs-approver.entity';
// import { CreateMeqsApproverInput } from './dto/create-meqs-approver.input';
// import { UpdateMeqsApproverInput } from './dto/update-meqs-approver.input';
// import { WarehouseRemoveResponse } from '../__common__/classes';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
// import { AuthUser } from '../__common__/auth-user.entity';
// import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { Employee } from '../__employee__/entities/employee.entity';
// import { UpdateMeqsOrderResponse } from './entities/update-meqs-order-response.entity';
// import { UpdateMeqsOrderInput } from './dto/update-meqs-order.input';
// import { isAdmin } from '../__common__/helpers';

@UseGuards(GqlAuthGuard)
@Resolver(() => MEQSApprover)
export class MeqsApproverResolver {
//   constructor(private readonly meqsApproverService: MeqsApproverService) { }

//   @Mutation(() => MEQSApprover)
//   createMeqsApprover(
//     @Args('input') createMeqsApproverInput: CreateMeqsApproverInput,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can create MEQS Approver')
//     }

//     this.meqsApproverService.setAuthUser(authUser)
//     return this.meqsApproverService.create(createMeqsApproverInput);
//   }

//   @Query(() => [MEQSApprover])
//   meqs_approvers(
//     @Args('meqs_id', { nullable: true }) meqs_id?: string,
//     @Args('meqs_number', { nullable: true }) meqs_number?: string,
//   ) {
//     if (meqs_id) {
//       return this.meqsApproverService.findByMeqsId(meqs_id)
//     }
//     if (meqs_number) {
//       return this.meqsApproverService.findByMeqsNumber(meqs_number)
//     }
//   }

//   @Query(() => MEQSApprover)
//   meqs_approver(@Args('id') id: string) {
//     return this.meqsApproverService.findOne(id);
//   }

//   @Mutation(() => MEQSApprover)
//   updateMeqsApprover(
//     @Args('id') id: string,
//     @Args('input') updateMeqsApproverInput: UpdateMeqsApproverInput,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {
//     this.meqsApproverService.setAuthUser(authUser)
//     return this.meqsApproverService.update(id, updateMeqsApproverInput);
//   }

//   @Mutation(() => UpdateMeqsOrderResponse)
//   async updateMEQSApproverOrder(
//     @Args('inputs', { type: () => [UpdateMeqsOrderInput] }) inputs: UpdateMeqsOrderInput[],
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can update MEQS Approver Order')
//     }

//     return await this.meqsApproverService.updateManyOrders(inputs);

//   }

//   @Mutation(() => WarehouseRemoveResponse)
//   removeMeqsApprover(
//     @Args('id') id: string,
//     @CurrentAuthUser() authUser: AuthUser
//   ) {

//     if (!isAdmin(authUser)) {
//       throw new ForbiddenException('Only Admin can remove MEQS Approver')
//     }

//     this.meqsApproverService.setAuthUser(authUser)
//     return this.meqsApproverService.remove(id);
//   }

  @ResolveField(() => Employee)
  approver(@Parent() meqsApprover: MEQSApprover): any {
    return { __typename: 'Employee', id: meqsApprover.approver_id }
  }

}
