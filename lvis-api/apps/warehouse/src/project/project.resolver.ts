import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateProjectInput } from './dto/update-project.input';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { ProjectsResponse } from './entities/projects-response.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {

  private readonly logger = new Logger(ProjectResolver.name);
  private filename = 'project.resolver.ts'
  
  constructor(private readonly projectService: ProjectService) { }

  @Mutation(() => Project)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.PROJECT, RESOLVERS.createProject)
  async createProject(
    @Args('input') createProjectInput: CreateProjectInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createProject,
        input: JSON.stringify(createProjectInput)
      })
      
      this.projectService.setAuthUser(authUser)
      const x = await this.projectService.create(createProjectInput);
      this.logger.log('Project created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating project', error)
    }
  }

  @Query(() => ProjectsResponse)
  projects(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('name', { nullable: true }) name?: string,
  ) {
    return this.projectService.findAll(page, pageSize, name);
  }

  @Query(() => [Project])
  projectsByName(
    @Args('input') input: string,
  ) {
    return this.projectService.findProjectsByName(input)
  }

  @Query(() => Project)
  project(@Args('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.PROJECT, RESOLVERS.updateProject)
  async updateProject(
    @Args('id') id: string,
    @Args('input') updateProjectInput: UpdateProjectInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateProject,
        project_id: id,
        input: JSON.stringify(updateProjectInput),
      })
      
      this.projectService.setAuthUser(authUser)
      const x = await this.projectService.update(id, updateProjectInput);
      this.logger.log('Project updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating project', error)
    }
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
