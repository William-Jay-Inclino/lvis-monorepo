import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MctService } from './mct.service';
import { MCT } from './entities/mct.entity';
import { CreateMctInput } from './dto/create-mct.input';
import { UpdateMctInput } from './dto/update-mct.input';

@Resolver(() => MCT)
export class MctResolver {
  constructor(private readonly mctService: MctService) {}

  @Mutation(() => MCT)
  createMct(@Args('createMctInput') createMctInput: CreateMctInput) {
    return this.mctService.create(createMctInput);
  }

  @Query(() => [MCT], { name: 'mct' })
  findAll() {
    return this.mctService.findAll();
  }

  @Query(() => MCT, { name: 'mct' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mctService.findOne(id);
  }

  @Mutation(() => MCT)
  updateMct(@Args('updateMctInput') updateMctInput: UpdateMctInput) {
    return this.mctService.update(updateMctInput.id, updateMctInput);
  }

  @Mutation(() => MCT)
  removeMct(@Args('id', { type: () => Int }) id: number) {
    return this.mctService.remove(id);
  }
}
