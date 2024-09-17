import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MrvService } from './mrv.service';
import { Mrv } from './entities/mrv.entity';
import { CreateMrvInput } from './dto/create-mrv.input';
import { UpdateMrvInput } from './dto/update-mrv.input';

@Resolver(() => Mrv)
export class MrvResolver {
  constructor(private readonly mrvService: MrvService) {}

  @Mutation(() => Mrv)
  createMrv(@Args('createMrvInput') createMrvInput: CreateMrvInput) {
    return this.mrvService.create(createMrvInput);
  }

  @Query(() => [Mrv], { name: 'mrv' })
  findAll() {
    return this.mrvService.findAll();
  }

  @Query(() => Mrv, { name: 'mrv' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mrvService.findOne(id);
  }

  @Mutation(() => Mrv)
  updateMrv(@Args('updateMrvInput') updateMrvInput: UpdateMrvInput) {
    return this.mrvService.update(updateMrvInput.id, updateMrvInput);
  }

  @Mutation(() => Mrv)
  removeMrv(@Args('id', { type: () => Int }) id: number) {
    return this.mrvService.remove(id);
  }
}
