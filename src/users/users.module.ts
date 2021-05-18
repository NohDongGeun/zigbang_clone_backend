import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/agency/entities/agency.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Room,Agency])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
