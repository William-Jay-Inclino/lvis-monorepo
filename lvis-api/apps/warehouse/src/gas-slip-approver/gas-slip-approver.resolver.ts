import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GasSlipApproverService } from './gas-slip-approver.service';
import { GasSlipApprover } from './entities/gas-slip-approver.entity';
import { CreateGasSlipApproverInput } from './dto/create-gas-slip-approver.input';
import { UpdateGasSlipApproverInput } from './dto/update-gas-slip-approver.input';
import { Employee } from '../__employee__/entities/employee.entity';

@Resolver(() => GasSlipApprover)
export class GasSlipApproverResolver {
  constructor(private readonly gasSlipApproverService: GasSlipApproverService) {}

  @Mutation(() => GasSlipApprover)
  createGasSlipApprover(@Args('createGasSlipApproverInput') createGasSlipApproverInput: CreateGasSlipApproverInput) {
    return this.gasSlipApproverService.create(createGasSlipApproverInput);
  }

  @Query(() => [GasSlipApprover], { name: 'gasSlipApprover' })
  findAll() {
    return this.gasSlipApproverService.findAll();
  }

  @Query(() => GasSlipApprover, { name: 'gasSlipApprover' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gasSlipApproverService.findOne(id);
  }

  @Mutation(() => GasSlipApprover)
  updateGasSlipApprover(@Args('updateGasSlipApproverInput') updateGasSlipApproverInput: UpdateGasSlipApproverInput) {
    return this.gasSlipApproverService.update(updateGasSlipApproverInput.id, updateGasSlipApproverInput);
  }

  @Mutation(() => GasSlipApprover)
  removeGasSlipApprover(@Args('id', { type: () => Int }) id: number) {
    return this.gasSlipApproverService.remove(id);
  }

  @ResolveField(() => Employee)
  approver(@Parent() gasSlipApprover: GasSlipApprover): any {
    return { __typename: 'Employee', id: gasSlipApprover.approver_id }
  }
  
}
