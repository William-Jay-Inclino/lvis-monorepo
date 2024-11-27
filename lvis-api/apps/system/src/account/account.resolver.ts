import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../__auth__/guards/gql-auth.guard';
import { UpdateAccountInput } from './dto/update-account.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { AuthUser } from '../__common__/auth-user.entity';
import { CurrentAuthUser } from '../__auth__/current-auth-user.decorator';
import { AccessGuard } from '../__auth__/guards/access.guard';
import { CheckAccess } from '../__auth__/check-access.decorator';
import { MODULES } from '../__common__/modules.enum';
import { RESOLVERS } from '../__common__/resolvers.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => Account)
export class AccountResolver {

  private readonly logger = new Logger(AccountResolver.name);
  private filename = 'account.resolver.ts'

  constructor(
    private readonly accountService: AccountService
  ) { }

  @Mutation(() => Account)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ACCOUNT, RESOLVERS.createAccount)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.createAccount,
        input: JSON.stringify(createAccountInput)
      })
      this.accountService.setAuthUser(authUser)
      return await this.accountService.create(createAccountInput);
    } catch (error) {
      this.logger.error('Error in creating account', error)
    }

  }

  @Query(() => [Account])
  async accounts(@CurrentAuthUser() authUser: AuthUser) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.accounts,
      })

      return await this.accountService.findAll();

    } catch (error) {
      this.logger.error('Error in getting accounts', error)
    }

  }

  @Query(() => Account)
  async account(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {
    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.account,
        account_id: id,
      })
      
      return await this.accountService.findOne(id);

    } catch (error) {
      this.logger.error('Error in getting account', error)
    }
  }

  @Mutation(() => Account)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ACCOUNT, RESOLVERS.updateAccount)
  async updateAccount(
    @Args('id') id: string,
    @Args('input') updateAccountInput: UpdateAccountInput,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {
      
      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.updateAccount,
        account_id: id,
        input: JSON.stringify(updateAccountInput),
      })
      
      this.accountService.setAuthUser(authUser)
      return await this.accountService.update(id, updateAccountInput);

    } catch (error) {
      this.logger.error('Error in updating account', error)
    }

  }

  @Mutation(() => SystemRemoveResponse)
  @UseGuards(AccessGuard)
  @CheckAccess(MODULES.ACCOUNT, RESOLVERS.removeAccount)
  async removeAccount(
    @Args('id') id: string,
    @CurrentAuthUser() authUser: AuthUser
  ) {

    try {

      this.logger.log({
        username: authUser.user.username,
        filename: this.filename,
        function: RESOLVERS.removeAccount,
        account_id: id,
      })

      this.accountService.setAuthUser(authUser)
      return await this.accountService.remove(id);
      
    } catch (error) {
      this.logger.error('Error in removing account', error)
    }

  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string, id: string }): Promise<Account> {
    return await this.accountService.findOne(reference.id)
  }

}
