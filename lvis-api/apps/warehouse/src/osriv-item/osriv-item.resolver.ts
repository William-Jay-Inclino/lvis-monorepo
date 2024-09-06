import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OsrivItemService } from './osriv-item.service';
// import { OsrivItem } from './entities/osriv-item.entity';
import { CreateOsrivItemInput } from './dto/create-osriv-item.input';
import { UpdateOsrivItemInput } from './dto/update-osriv-item.input';

// @Resolver(() => OsrivItem)
// export class OsrivItemResolver {
//   constructor(private readonly osrivItemService: OsrivItemService) {}

//   @Mutation(() => OsrivItem)
//   createOsrivItem(@Args('createOsrivItemInput') createOsrivItemInput: CreateOsrivItemInput) {
//     return this.osrivItemService.create(createOsrivItemInput);
//   }

//   @Query(() => [OsrivItem], { name: 'osrivItem' })
//   findAll() {
//     return this.osrivItemService.findAll();
//   }

//   @Query(() => OsrivItem, { name: 'osrivItem' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.osrivItemService.findOne(id);
//   }

//   @Mutation(() => OsrivItem)
//   updateOsrivItem(@Args('updateOsrivItemInput') updateOsrivItemInput: UpdateOsrivItemInput) {
//     return this.osrivItemService.update(updateOsrivItemInput.id, updateOsrivItemInput);
//   }

//   @Mutation(() => OsrivItem)
//   removeOsrivItem(@Args('id', { type: () => Int }) id: number) {
//     return this.osrivItemService.remove(id);
//   }
// }
