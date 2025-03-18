import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskAssignmentService } from './task_assignment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { TaskAssignment } from './entities/task_assignment.entity';
import { Department } from '../__department__ /entities/department.entity';
import { Division } from '../__division__/entities/division.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => TaskAssignment)
export class TaskAssignmentResolver {

    constructor(private readonly service: TaskAssignmentService) {}

    // @ResolveField(() => Department, { nullable: true })
    // department(@Parent() taskAssignment: TaskAssignment): any {
    //     if(!taskAssignment.department_id || taskAssignment.department_id === 'undefined') {
    //         return null 
    //     }
    //     return { __typename: 'Department', id: taskAssignment.department_id }
    // }

    // @ResolveField(() => Division, { nullable: true })
    // division(@Parent() taskAssignment: TaskAssignment): any {
    //     if(!taskAssignment.division_id || taskAssignment.division_id === 'undefined') {
    //         return null 
    //     }
    //     return { __typename: 'Division', id: taskAssignment.division_id }
    // }

}
