import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FuelTypeService } from './fuel-type.service';
import { FuelType } from './entities/fuel-type.entity';
import { CreateFuelTypeInput } from './dto/create-fuel-type.input';
import { UpdateFuelTypeInput } from './dto/update-fuel-type.input';

@Resolver(() => FuelType)
export class FuelTypeResolver {
  constructor(private readonly fuelTypeService: FuelTypeService) {}

  @Mutation(() => FuelType)
  createFuelType(@Args('createFuelTypeInput') createFuelTypeInput: CreateFuelTypeInput) {
    return this.fuelTypeService.create(createFuelTypeInput);
  }

  @Query(() => [FuelType], { name: 'fuelType' })
  findAll() {
    return this.fuelTypeService.findAll();
  }

  @Query(() => FuelType, { name: 'fuelType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fuelTypeService.findOne(id);
  }

  @Mutation(() => FuelType)
  updateFuelType(@Args('updateFuelTypeInput') updateFuelTypeInput: UpdateFuelTypeInput) {
    return this.fuelTypeService.update(updateFuelTypeInput.id, updateFuelTypeInput);
  }

  @Mutation(() => FuelType)
  removeFuelType(@Args('id', { type: () => Int }) id: number) {
    return this.fuelTypeService.remove(id);
  }
}
