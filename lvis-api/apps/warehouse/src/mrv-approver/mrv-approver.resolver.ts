import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MrvApproverService } from './mrv-approver.service';
import { MrvApprover } from './entities/mrv-approver.entity';
import { CreateMrvApproverInput } from './dto/create-mrv-approver.input';
import { UpdateMrvApproverInput } from './dto/update-mrv-approver.input';

@Resolver(() => MrvApprover)
export class MrvApproverResolver {
  constructor(private readonly mrvApproverService: MrvApproverService) {}

  @Mutation(() => MrvApprover)
  createMrvApprover(@Args('createMrvApproverInput') createMrvApproverInput: CreateMrvApproverInput) {
    return this.mrvApproverService.create(createMrvApproverInput);
  }

  @Query(() => [MrvApprover], { name: 'mrvApprover' })
  findAll() {
    return this.mrvApproverService.findAll();
  }

  @Query(() => MrvApprover, { name: 'mrvApprover' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mrvApproverService.findOne(id);
  }

  @Mutation(() => MrvApprover)
  updateMrvApprover(@Args('updateMrvApproverInput') updateMrvApproverInput: UpdateMrvApproverInput) {
    return this.mrvApproverService.update(updateMrvApproverInput.id, updateMrvApproverInput);
  }

  @Mutation(() => MrvApprover)
  removeMrvApprover(@Args('id', { type: () => Int }) id: number) {
    return this.mrvApproverService.remove(id);
  }
}
