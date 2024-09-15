import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SerivService } from './seriv.service';
import { SERIV } from './entities/seriv.entity';
import { CreateSerivInput } from './dto/create-seriv.input';
import { UpdateSerivInput } from './dto/update-seriv.input';

@Resolver(() => SERIV)
export class SerivResolver {
  constructor(private readonly serivService: SerivService) {}

  // @Mutation(() => SERIV)
  // createSeriv(@Args('createSerivInput') createSerivInput: CreateSerivInput) {
  //   return this.serivService.create(createSerivInput);
  // }

  // @Query(() => [SERIV], { name: 'seriv' })
  // findAll() {
  //   return this.serivService.findAll();
  // }

  // @Query(() => SERIV, { name: 'seriv' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivService.findOne(id);
  // }

  // @Mutation(() => SERIV)
  // updateSeriv(@Args('updateSerivInput') updateSerivInput: UpdateSerivInput) {
  //   return this.serivService.update(updateSerivInput.id, updateSerivInput);
  // }

  // @Mutation(() => SERIV)
  // removeSeriv(@Args('id', { type: () => Int }) id: number) {
  //   return this.serivService.remove(id);
  // }
}
