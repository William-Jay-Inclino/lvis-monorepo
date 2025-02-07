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
import { ClassificationsResponse } from './entities/classifications-response.entity';
import { SystemAuditService } from '../system_audit/system_audit.service';
import { IpAddress } from '../__auth__/ip-address.decorator';
import { UserAgent } from '../__auth__/user-agent.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => Classification)
export class ClassificationResolver {

    private readonly logger = new Logger(ClassificationResolver.name);
    private filename = 'classification.resolver.ts'

  constructor(
    private readonly classificationService: ClassificationService,
    private readonly audit: SystemAuditService,
  ) { }

  @Mutation(() => Classification)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CLASSIFICATION, RESOLVERS.createClassification)
  async createClassification(
    @Args('input') createClassificationInput: CreateClassificationInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Creating classification...', {
      username: authUser.user.username,
      filename: this.filename,
      input: JSON.stringify(createClassificationInput)
    })

    try {
      
      const x = await this.classificationService.create(createClassificationInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
      this.logger.log('Classification created successfully')

      return x

    } catch (error) {
      this.logger.error('Error in creating classification', error)
    }

  }

  @Query(() => ClassificationsResponse)
  classifications(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('name', { nullable: true }) name?: string,
  ) {
    return this.classificationService.findAll(page, pageSize, name);
  }

  @Query(() => Classification)
  classification(@Args('id') id: string) {
    return this.classificationService.findOne(id);
  }

  @Query(() => [Classification])
  classificationsByName(
    @Args('input') input: string,
  ) {
    return this.classificationService.findClassificationsByName(input)
  }

  @Mutation(() => Classification)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.CLASSIFICATION, RESOLVERS.updateClassification)
  async updateClassification(
    @Args('id') id: string,
    @Args('input') updateClassificationInput: UpdateClassificationInput,
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {

    this.logger.log('Updating classification...', {
      username: authUser.user.username,
      filename: this.filename,
      classification_id: id,
      input: JSON.stringify(updateClassificationInput),
    })

    try {
      
      const x = await this.classificationService.update(id, updateClassificationInput, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });

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
    @CurrentAuthUser() authUser: AuthUser,
    @UserAgent() user_agent: string,
    @IpAddress() ip_address: string,
  ) {
    this.logger.log('Removing account...', {
      username: authUser.user.username,
      filename: this.filename,
      classification_id: id,
    })

    try {

      const x = await this.classificationService.remove(id, {
        ip_address,
        device_info: this.audit.getDeviceInfo(user_agent),
        authUser,
      });
      
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
