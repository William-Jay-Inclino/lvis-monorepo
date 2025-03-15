import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ComplaintAssignmentService } from './complaint_assignment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { ComplaintAssignment } from './entities/complaint_assignment.entity';
import { Department } from '../__department__ /entities/department.entity';
import { Division } from '../__division__/entities/division.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => ComplaintAssignment)
export class ComplaintAssignmentResolver {

    constructor(private readonly complaintAssignmentService: ComplaintAssignmentService) {}

    @ResolveField(() => Department, { nullable: true })
    department(@Parent() complaintAssignment: ComplaintAssignment): any {
        if(!complaintAssignment.department_id || complaintAssignment.department_id === 'undefined') {
            return null 
        }
        return { __typename: 'Department', id: complaintAssignment.department_id }
    }

    @ResolveField(() => Division, { nullable: true })
    division(@Parent() complaintAssignment: ComplaintAssignment): any {
        if(!complaintAssignment.division_id || complaintAssignment.division_id === 'undefined') {
            return null 
        }
        return { __typename: 'Division', id: complaintAssignment.division_id }
    }

}
