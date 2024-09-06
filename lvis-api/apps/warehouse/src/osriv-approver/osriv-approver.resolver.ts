import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OsrivApproverService } from './osriv-approver.service';
import { OSRIVApprover } from './entities/osriv-approver.entity';
import { CreateOsrivApproverInput } from './dto/create-osriv-approver.input';
import { UpdateOsrivApproverInput } from './dto/update-osriv-approver.input';

// @Resolver(() => OsrivApprover)
// export class OsrivApproverResolver {
//   constructor(private readonly osrivApproverService: OsrivApproverService) {}

//   @Mutation(() => OsrivApprover)
//   createOsrivApprover(@Args('createOsrivApproverInput') createOsrivApproverInput: CreateOsrivApproverInput) {
//     return this.osrivApproverService.create(createOsrivApproverInput);
//   }

//   @Query(() => [OsrivApprover], { name: 'osrivApprover' })
//   findAll() {
//     return this.osrivApproverService.findAll();
//   }

//   @Query(() => OsrivApprover, { name: 'osrivApprover' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.osrivApproverService.findOne(id);
//   }

//   @Mutation(() => OsrivApprover)
//   updateOsrivApprover(@Args('updateOsrivApproverInput') updateOsrivApproverInput: UpdateOsrivApproverInput) {
//     return this.osrivApproverService.update(updateOsrivApproverInput.id, updateOsrivApproverInput);
//   }

//   @Mutation(() => OsrivApprover)
//   removeOsrivApprover(@Args('id', { type: () => Int }) id: number) {
//     return this.osrivApproverService.remove(id);
//   }
// }
