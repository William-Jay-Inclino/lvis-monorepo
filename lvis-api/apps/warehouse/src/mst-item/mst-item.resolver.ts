import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MstItemService } from './mst-item.service';
import { MSTItem } from './entities/mst-item.entity';
import { CreateMstItemInput } from './dto/create-mst-item.input';
import { UpdateMstItemInput } from './dto/update-mst-item.input';

@Resolver(() => MSTItem)
export class MstItemResolver {
  constructor(private readonly mstItemService: MstItemService) {}

  @Mutation(() => MSTItem)
  createMstItem(@Args('createMstItemInput') createMstItemInput: CreateMstItemInput) {
    return this.mstItemService.create(createMstItemInput);
  }

  @Query(() => [MSTItem], { name: 'mstItem' })
  findAll() {
    return this.mstItemService.findAll();
  }

  @Query(() => MSTItem, { name: 'mstItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mstItemService.findOne(id);
  }

  @Mutation(() => MSTItem)
  updateMstItem(@Args('updateMstItemInput') updateMstItemInput: UpdateMstItemInput) {
    return this.mstItemService.update(updateMstItemInput.id, updateMstItemInput);
  }

  @Mutation(() => MSTItem)
  removeMstItem(@Args('id', { type: () => Int }) id: number) {
    return this.mstItemService.remove(id);
  }
}
