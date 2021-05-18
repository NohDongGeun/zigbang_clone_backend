import { UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { throws } from 'assert';
import { AuthAgency } from 'src/auth/auth-agency.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthAgencyGuard } from 'src/auth/auth.agency.guard';
import { AuthUserGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AgencyService } from './agency.service';
import { AgencyProfileInput, AgencyProfileOutput } from './dtos/agency-profile.dto';
import { CreateAgencyInput, CreateAgencyOutput } from './dtos/create-agency.dto';
import { DeleteAgencyOutput } from './dtos/delete-agency.dto';
import { EditAgencyProfileInput, EditAgencyProfileOutput } from './dtos/edit-profile.dto';
import { AgencyAllRoomsInput, AgencyAllRoomsOutput } from './dtos/show-agencyRoom-ALL.dto';
import { Agency } from './entities/agency.entity';
import { Express } from 'express';
import { IsAgencyInput, IsAgencyOutput } from './dtos/isAgency.dto';

@Resolver(of => Agency)
export class AgencyResolver {
  constructor(private readonly agencyService: AgencyService) {}

  //create agency
  @UseGuards(AuthUserGuard)
  @Mutation(returns => CreateAgencyOutput)
  createAgency(@AuthUser() authUser: User, @Args('input') createAgencyInput: CreateAgencyInput) {
    return this.agencyService.createAgency(authUser.id, createAgencyInput);
  }

  //agency 프로필 보기
  @UseGuards(AuthUserGuard)
  @Query(returns => AgencyProfileOutput)
  agencyProfile(@AuthUser() authUser: User) {
    return this.agencyService.agencyProfile(authUser.id);
  }

  //agency 프로필 업데이트
  @UseGuards(AuthUserGuard)
  @Mutation(returns => EditAgencyProfileOutput)
  agencyEditProfile(@AuthUser() authUser: User, @Args('input') editAgencyProfileInput: EditAgencyProfileInput) {
    return this.agencyService.agencyEditProfile(authUser.id, editAgencyProfileInput);
  }

  //agency 프로필 업데이트
  @UseGuards(AuthUserGuard)
  @Query(returns => AgencyAllRoomsOutput)
  agencyShowAllRoom(@AuthUser() authUser: User) {
    return this.agencyService.showAgencyAllRoom(authUser.id);
  }

  @UseGuards(AuthUserGuard)
  @Query(returns => DeleteAgencyOutput)
  deleteAgency(@AuthUser() authUser: User) {
    return this.agencyService.deleteAgency(authUser.id);
  }

  @UseGuards(AuthUserGuard)
  @Query(returns => DeleteAgencyOutput)
  isAgency(@AuthUser() authUser: User, @Args('input') isAgencyInput: IsAgencyInput): Promise<IsAgencyOutput> {
    return this.agencyService.isAgency(authUser.id, isAgencyInput);
  }

  // //계정생성
  // @Mutation(returns => CreateAgencyOutput)
  // createAgency(@Args('input') createAgencyInput: CreateAgencyInput) {
  //   return this.agencyService.createAgency(createAgencyInput);
  // }

  // //로그인
  // @Mutation(returns => LoginAgencyOutput)
  // loginAgency(@Args('input') loginAgencyInput: LoginAgencyInput): Promise<LoginAgencyOutput> {
  //   return this.agencyService.login(loginAgencyInput);
  // }
  // @Query(returns => Agency)
  // @UseGuards(AuthAgencyGuard)
  // agency(@AuthAgency() authAgency: Agency) {
  //   return authAgency;
  // }

  // //프로필보기
  // @UseGuards(AuthAgencyGuard)
  // @Query(returns => AgencyProfileOutput)
  // agencyProfile(@Args() agencyProfileInput: AgencyProfileInput): Promise<AgencyProfileOutput> {
  //   return this.agencyService.findById(agencyProfileInput.agencyId);
  // }

  // //프로필 수정
  // @UseGuards(AuthAgencyGuard)
  // @Mutation(returns => EditAgencyProfileOutput)
  // editAgencyProfile(
  //   @AuthAgency() authAgency: Agency,
  //   @Args('input') editProfileInput: EditAgencyProfileInput,
  // ): Promise<EditAgencyProfileOutput> {
  //   return this.agencyService.editProfile(authAgency.id, editProfileInput);
  // }

  // @Query(returns => AgencyAllRoomsOutput)
  // showAgencyAllRoom(@Args() agencyAllRoomsInput: AgencyAllRoomsInput): Promise<AgencyAllRoomsOutput> {
  //   return this.agencyService.showAgencyAllRoom(agencyAllRoomsInput.id);
  // }
}
