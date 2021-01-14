import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyResolver } from './agency.resolver';
import { AgencyService } from './agency.service';
import { Agency } from './entities/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency])],
  providers: [AgencyService, AgencyResolver],
  exports: [AgencyService],
})
export class AgencyModule {}
