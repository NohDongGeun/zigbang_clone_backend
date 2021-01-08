import { Module } from '@nestjs/common';
import { RoomResolver } from './room.resolver';

@Module({
  providers: [RoomResolver],
})
export class RoomModule {}
