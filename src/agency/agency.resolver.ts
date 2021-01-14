import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthAgency } from 'src/auth/auth-agency.decorator';
import { AuthAgencyGuard } from 'src/auth/auth.agency.guard';
import { AgencyService } from './agency.service';
import { AgencyProfileInput, AgencyProfileOutput } from './dtos/agency-profile.dto';
import { CreateAgencyInput, CreateAgencyOutput } from './dtos/create-agency.dto';
import { EditAgencyProfileInput, EditAgencyProfileOutput } from './dtos/edit-profile.dto';
import { LoginAgencyInput, LoginAgencyOutput } from './dtos/login-agency.dto';
import { Agency } from './entities/agency.entity';

@Resolver(of => Agency)
export class AgencyResolver {
  constructor(private readonly agencyService: AgencyService) {}

  @Mutation(returns => CreateAgencyOutput)
  createAgency(@Args('input') createAgencyInput: CreateAgencyInput) {
    return this.agencyService.createAgency(createAgencyInput);
  }

  @Mutation(returns => LoginAgencyOutput)
  loginAgency(@Args('input') loginAgencyInput: LoginAgencyInput): Promise<LoginAgencyOutput> {
    return this.agencyService.login(loginAgencyInput);
  }
  @Query(returns => Agency)
  @UseGuards(AuthAgencyGuard)
  agency(@AuthAgency() authAgency: Agency) {
    return authAgency;
  }

  @UseGuards(AuthAgencyGuard)
  @Query(returns => AgencyProfileOutput)
  agencyProfile(@Args() agencyProfileInput: AgencyProfileInput): Promise<AgencyProfileOutput> {
    return this.agencyService.findById(agencyProfileInput.agencyId);
  }

  @UseGuards(AuthAgencyGuard)
  @Mutation(returns => EditAgencyProfileOutput)
  editAgencyProfile(
    @AuthAgency() authAgency: Agency,
    @Args('input') editProfileInput: EditAgencyProfileInput,
  ): Promise<EditAgencyProfileOutput> {
    return this.agencyService.editProfile(authAgency.id, editProfileInput);
  }
}
