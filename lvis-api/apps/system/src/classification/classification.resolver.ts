import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { ClassificationService } from './classification.service';
import { Classification } from './entities/classification.entity';
import { CreateClassificationInput } from './dto/create-classification.input';
import { UpdateClassificationInput } from './dto/update-classification.input';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { SystemRemoveResponse } from '../__common__/classes';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from '../__common__/modules.enum';
import { RESOLVERS } from '../__common__/resolvers.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => Classification)
export class ClassificationResolver {

    private readonly logger = new Logger(ClassificationResolver.name);
    private filename = 'classification.resolver.ts'

  constructor(private readonly classificationService: ClassificationService) { }

  @Mutation(() => Classification)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CLASSIFICATION, RESOLVERS.createClassification)
  async createClassification(
    @Args('input') createClassificationInput: CreateClassificationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createClassification,
        input: JSON.stringify(createClassificationInput)
      })
      
      this.classificationService.setAuthUser(authUser)
      const x = await this.classificationService.create(createClassificationInput);
      
      this.logger.log('Account created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating classification', error)
    }

  }

  @Query(() => [Classification])
  classifications() {
    return this.classificationService.findAll();
  }

  @Query(() => Classification)
  classification(@Args('id') id: string) {
    return this.classificationService.findOne(id);
  }

  @Mutation(() => Classification)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CLASSIFICATION, RESOLVERS.updateClassification)
  async updateClassification(
    @Args('id') id: string,
    @Args('input') updateClassificationInput: UpdateClassificationInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateClassification,
        classification_id: id,
        input: JSON.stringify(updateClassificationInput),
      })
      
      this.classificationService.setAuthUser(authUser)
      const x = await this.classificationService.update(id, updateClassificationInput);

      this.logger.log('Classification updated successfully')

      return x
    } catch (error) {
      this.logger.error('Error in updating classification', error)
    }

  }

  @Mutation(() => SystemRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CLASSIFICATION, RESOLVERS.removeClassification)
  async removeClassification(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeClassification,
        classification_id: id,
      })

      this.classificationService.setAuthUser(authUser)
      const x = await this.classificationService.remove(id);
      
      this.logger.log('Classification removed successfully')
      
      return x 

    } catch (error) {
      this.logger.error('Error in removing classification', error)
    }
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string, id: string }): Promise<Classification> {
    return await this.classificationService.findOne(reference.id)
  }

}
