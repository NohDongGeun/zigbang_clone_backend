import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRoomDto } from './entities/dtos/createRoom.dto';
import { Room } from './entities/room.entity';

@Resolver(of => Room)
export class RoomResolver {
  @Query(returns => [Room])
  rooms(@Args('veganOnly') veganOnly: boolean): Room[] {
    return [];
  }

  @Mutation(returns => Boolean)
  createRoom(@Args() createRoomDto: CreateRoomDto) {
    return true;
  }
}
