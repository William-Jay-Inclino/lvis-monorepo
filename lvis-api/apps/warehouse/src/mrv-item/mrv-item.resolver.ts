import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MrvItemService } from './mrv-item.service';
import { MrvItem } from './entities/mrv-item.entity';
import { CreateMrvItemInput } from './dto/create-mrv-item.input';
import { UpdateMrvItemInput } from './dto/update-mrv-item.input';

@Resolver(() => MrvItem)
export class MrvItemResolver {
  constructor(private readonly mrvItemService: MrvItemService) {}

  @Mutation(() => MrvItem)
  createMrvItem(@Args('createMrvItemInput') createMrvItemInput: CreateMrvItemInput) {
    return this.mrvItemService.create(createMrvItemInput);
  }

  @Query(() => [MrvItem], { name: 'mrvItem' })
  findAll() {
    return this.mrvItemService.findAll();
  }

  @Query(() => MrvItem, { name: 'mrvItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mrvItemService.findOne(id);
  }

  @Mutation(() => MrvItem)
  updateMrvItem(@Args('updateMrvItemInput') updateMrvItemInput: UpdateMrvItemInput) {
    return this.mrvItemService.update(updateMrvItemInput.id, updateMrvItemInput);
  }

  @Mutation(() => MrvItem)
  removeMrvItem(@Args('id', { type: () => Int }) id: number) {
    return this.mrvItemService.remove(id);
  }
}
