import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUserGuard } from 'src/auth/auth.guard';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { PasswordEmailInput, PasswordEmailOutput } from './dtos/password-email.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  //계정생성
  @Mutation(returns => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  //로그인
  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Query(returns => User)
  @UseGuards(AuthUserGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  //유저 프로필
  @UseGuards(AuthUserGuard)
  @Query(returns => UserProfileOutput)
  userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    return this.userService.findById(userProfileInput.userId);
  }

  //프로필 수정
  @UseGuards(AuthUserGuard)
  @Mutation(returns => EditProfileOutput)
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.userService.editProfile(authUser.id, editProfileInput);
  }

  //이메일 인증
  @Mutation(returns => VerifyEmailOutput)
  verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(code);
  }

  @Mutation(returns => PasswordEmailOutput)
  passwordEmail(@Args('input') passwordEmailInput: PasswordEmailInput): Promise<PasswordEmailOutput> {
    return this.userService.findPassword(passwordEmailInput);
  }
}
