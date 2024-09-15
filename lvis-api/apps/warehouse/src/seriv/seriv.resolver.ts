import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SerivService } from './seriv.service';
import { Seriv } from './entities/seriv.entity';
import { CreateSerivInput } from './dto/create-seriv.input';
import { UpdateSerivInput } from './dto/update-seriv.input';

@Resolver(() => Seriv)
export class SerivResolver {
  constructor(private readonly serivService: SerivService) {}

  @Mutation(() => Seriv)
  createSeriv(@Args('createSerivInput') createSerivInput: CreateSerivInput) {
    return this.serivService.create(createSerivInput);
  }

  @Query(() => [Seriv], { name: 'seriv' })
  findAll() {
    return this.serivService.findAll();
  }

  @Query(() => Seriv, { name: 'seriv' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.serivService.findOne(id);
  }

  @Mutation(() => Seriv)
  updateSeriv(@Args('updateSerivInput') updateSerivInput: UpdateSerivInput) {
    return this.serivService.update(updateSerivInput.id, updateSerivInput);
  }

  @Mutation(() => Seriv)
  removeSeriv(@Args('id', { type: () => Int }) id: number) {
    return this.serivService.remove(id);
  }
}
