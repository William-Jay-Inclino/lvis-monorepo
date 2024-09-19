import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateProjectInput } from './dto/update-project.input';
import { WarehouseRemoveResponse } from '../__common__/classes';

import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES, RESOLVERS } from '../__common__/types';

@UseGuards(GqlAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) { }

  @Mutation(() => Project)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.PROJECT, RESOLVERS.createProject)
  createProject(
    @Args('input') createProjectInput: CreateProjectInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.projectService.setAuthUser(authUser)
    return this.projectService.create(createProjectInput);
  }

  @Query(() => [Project])
  projects() {
    return this.projectService.findAll();
  }

  @Query(() => Project)
  project(@Args('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.PROJECT, RESOLVERS.updateProject)
  updateProject(
    @Args('id') id: string,
    @Args('input') updateProjectInput: UpdateProjectInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.projectService.setAuthUser(authUser)
    return this.projectService.update(id, updateProjectInput);
  }

  @Mutation(() => WarehouseRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.PROJECT, RESOLVERS.removeProject)
  removeProject(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    this.projectService.setAuthUser(authUser)
    return this.projectService.remove(id);
  }

}
