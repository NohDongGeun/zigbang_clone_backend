import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUserGuard } from 'src/auth/auth.guard';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UpdatePasswordOutput, UpdatePasswordInput } from './dtos/update-password.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const { ok, error } = await this.userService.createAccount(createAccountInput);
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const { ok, token, error } = await this.userService.login(loginInput);
      return { ok, error, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  @Query(returns => User)
  @UseGuards(AuthUserGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Mutation(returns => UpdatePasswordOutput)
  @UseGuards(AuthUserGuard)
  async updatePassword(
    @AuthUser() authUser: User,
    @Args('input') updatePasswordInput: UpdatePasswordInput,
  ): Promise<UpdatePasswordOutput> {
    try {
      await this.userService.updatePassword(authUser.id, updatePasswordInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
