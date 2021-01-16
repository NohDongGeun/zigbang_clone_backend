import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/agency/entities/agency.entity';
import { Location } from 'src/location/entities/location.entity';
import { Expenses } from './entities/expense.entity';
import { Options } from './entities/options.entity';
import { Room } from './entities/room.entity';
import { RoomResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Options, Expenses, Agency, Location])],
  providers: [RoomsService, RoomResolver],
  exports: [RoomsService],
})
export class RoomsModule {}
