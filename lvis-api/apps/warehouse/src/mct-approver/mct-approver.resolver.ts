import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MctApproverService } from './mct-approver.service';
import { MCTApprover } from './entities/mct-approver.entity';
import { CreateMctApproverInput } from './dto/create-mct-approver.input';
import { UpdateMctApproverInput } from './dto/update-mct-approver.input';

@Resolver(() => MCTApprover)
export class MctApproverResolver {
  constructor(private readonly mctApproverService: MctApproverService) {}

  @Mutation(() => MCTApprover)
  createMctApprover(@Args('createMctApproverInput') createMctApproverInput: CreateMctApproverInput) {
    return this.mctApproverService.create(createMctApproverInput);
  }

  @Query(() => [MCTApprover], { name: 'mctApprover' })
  findAll() {
    return this.mctApproverService.findAll();
  }

  @Query(() => MCTApprover, { name: 'mctApprover' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mctApproverService.findOne(id);
  }

  @Mutation(() => MCTApprover)
  updateMctApprover(@Args('updateMctApproverInput') updateMctApproverInput: UpdateMctApproverInput) {
    return this.mctApproverService.update(updateMctApproverInput.id, updateMctApproverInput);
  }

  @Mutation(() => MCTApprover)
  removeMctApprover(@Args('id', { type: () => Int }) id: number) {
    return this.mctApproverService.remove(id);
  }
}
