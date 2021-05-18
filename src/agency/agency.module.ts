import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { AgencyResolver } from './agency.resolver';
import { AgencyService } from './agency.service';
import { Agency } from './entities/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User, Room])],
  providers: [AgencyService, AgencyResolver],
  exports: [AgencyService],
})
export class AgencyModule {}
