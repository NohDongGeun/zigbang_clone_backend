import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUserGuard } from 'src/auth/auth.guard';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { CreateVerifyInput, CreateVerifyOutput } from './dtos/create-verify.dto';
import { CreateZzimInput, CreateZzimOutput } from './dtos/create-zzim.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { FindPhoneOutput } from './dtos/find-phone.dto';
import { FindZzimOutput } from './dtos/find-zzimRooms.dto';
import { FindIdPhoneInput, FindIdPhoneOutput } from './dtos/findId-phone.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { PasswordEmailInput, PasswordEmailOutput } from './dtos/password-email.dto';
import { SendSmsInput, SendSmsOutput } from './dtos/send-sms.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/userProfile.dto';
import { VerifyUserInput, VerifyUserOutput } from './dtos/verify-user.dto';
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

  //verify checking 중인 유저 휴대폰 번호 찾기
  @Query(returns => FindPhoneOutput)
  @UseGuards(AuthUserGuard)
  findPhone(@AuthUser() authUser: User): Promise<FindPhoneOutput> {
    return this.userService.findVerifyPhone(authUser);
  }

  //verify check 전용쿼리
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
  //매물 찜하기
  @UseGuards(AuthUserGuard)
  @Mutation(returns => CreateZzimOutput)
  createZzim(@AuthUser() authUser: User, @Args('input') createZzimInput: CreateZzimInput): Promise<CreateZzimOutput> {
    return this.userService.zzimRooms(authUser.id, createZzimInput);
  }
  @UseGuards(AuthUserGuard)
  @Mutation(returns => CreateZzimOutput)
  deleteZzim(@AuthUser() authUser: User, @Args('input') createZzimInput: CreateZzimInput): Promise<CreateZzimOutput> {
    return this.userService.deleteZzimRooms(authUser.id, createZzimInput);
  }

  //이메일 인증
  @UseGuards(AuthUserGuard)
  @Mutation(returns => VerifyUserOutput)
  verifyPhone(@AuthUser() authUser: User, @Args('input') { code }: VerifyUserInput): Promise<VerifyUserOutput> {
    return this.userService.verifyPhone(authUser, code);
  }

  @Mutation(returns => PasswordEmailOutput)
  passwordEmail(@Args('input') passwordEmailInput: PasswordEmailInput): Promise<PasswordEmailOutput> {
    return this.userService.findPassword(passwordEmailInput);
  }
  @UseGuards(AuthUserGuard)
  @Mutation(retuns => CreateVerifyOutput)
  createVerify(
    @AuthUser() authUser: User,
    @Args('input') createVerifyInput: CreateVerifyInput,
  ): Promise<CreateVerifyOutput> {
    return this.userService.createVerify(authUser.id, createVerifyInput);
  }

  @Mutation(returns => FindIdPhoneOutput)
  findIdPhone(@Args('input') findIdPhoneInput: FindIdPhoneInput): Promise<FindIdPhoneOutput> {
    return this.userService.findIdPhone(findIdPhoneInput);
  }

  @UseGuards(AuthUserGuard)
  @Query(type => FindZzimOutput)
  findZzimRooms(@AuthUser() authUser: User): Promise<FindZzimOutput> {
    return this.userService.findZzimRooms(authUser.id);
  }

  @UseGuards(AuthUserGuard)
  @Mutation(returns => SendSmsOutput)
  sendSmsAgency(@AuthUser() authUser: User, @Args('input') sendSmsInput: SendSmsInput): Promise<SendSmsOutput> {
    return this.userService.sendAgencySms(authUser.id, sendSmsInput);
  }
}
