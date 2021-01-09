import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRoomDto } from './entities/dtos/createRoom.dto';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

@Resolver(of => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}
  @Query(returns => [Room])
  rooms(): Promise<Room[]> {
    return this.roomService.getAll();
  }

  @Mutation(returns => Boolean)
  createRoom(@Args() createRoomDto: CreateRoomDto) {
    return true;
  }
}
