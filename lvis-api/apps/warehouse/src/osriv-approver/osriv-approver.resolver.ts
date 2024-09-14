import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { OSRIVApprover } from './entities/osriv-approver.entity';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Employee } from '../__employee__/entities/employee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => OSRIVApprover)
export class OsrivApproverResolver {

  @ResolveField(() => Employee)
  approver(@Parent() osrivApprover: OSRIVApprover): any {
    console.log('osrivApprover', osrivApprover);
    return { __typename: 'Employee', id: osrivApprover.approver_id }
  }

}
