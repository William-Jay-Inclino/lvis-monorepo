import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SerivApproverService } from './seriv-approver.service';
import { SERIVApprover } from './entities/seriv-approver.entity';
import { CreateSerivApproverInput } from './dto/create-seriv-approver.input';
import { UpdateSerivApproverInput } from './dto/update-seriv-approver.input';

@Resolver(() => SERIVApprover)
export class SerivApproverResolver {
  constructor(private readonly serivApproverService: SerivApproverService) {}

  // @Mutation(() => SerivApprover)
  // createSerivApprover(@Args('createSerivApproverInput') createSerivApproverInput: CreateSerivApproverInput) {
  //   return this.serivApproverService.create(createSerivApproverInput);
  // }

  // @Query(() => [SerivApprover], { name: 'serivApprover' })
  // findAll() {
  //   return this.serivApproverService.findAll();
  // }

  // @Query(() => SerivApprover, { name: 'serivApprover' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivApproverService.findOne(id);
  // }

  // @Mutation(() => SerivApprover)
  // updateSerivApprover(@Args('updateSerivApproverInput') updateSerivApproverInput: UpdateSerivApproverInput) {
  //   return this.serivApproverService.update(updateSerivApproverInput.id, updateSerivApproverInput);
  // }

  // @Mutation(() => SerivApprover)
  // removeSerivApprover(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivApproverService.remove(id);
  // }
}
