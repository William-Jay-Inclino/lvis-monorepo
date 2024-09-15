import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SerivItemService } from './seriv-item.service';
import { SERIVItem } from './entities/seriv-item.entity';
import { CreateSerivItemInput } from './dto/create-seriv-item.input';
import { UpdateSerivItemInput } from './dto/update-seriv-item.input';

@Resolver(() => SERIVItem)
export class SerivItemResolver {
  constructor(private readonly serivItemService: SerivItemService) {}

  // @Mutation(() => SerivItem)
  // createSerivItem(@Args('createSerivItemInput') createSerivItemInput: CreateSerivItemInput) {
  //   return this.serivItemService.create(createSerivItemInput);
  // }

  // @Query(() => [SerivItem], { name: 'serivItem' })
  // findAll() {
  //   return this.serivItemService.findAll();
  // }

  // @Query(() => SerivItem, { name: 'serivItem' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivItemService.findOne(id);
  // }

  // @Mutation(() => SerivItem)
  // updateSerivItem(@Args('updateSerivItemInput') updateSerivItemInput: UpdateSerivItemInput) {
  //   return this.serivItemService.update(updateSerivItemInput.id, updateSerivItemInput);
  // }

  // @Mutation(() => SerivItem)
  // removeSerivItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivItemService.remove(id);
  // }
}
