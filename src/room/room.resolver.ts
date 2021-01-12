import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRoomDto } from './entities/dtos/createRoom.dto';
import { UpdateRoomDto } from './entities/dtos/updateRoom.dto';
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
  async createRoom(@Args('input') createRoomDto: CreateRoomDto): Promise<Boolean> {
    try {
      await this.roomService.createRoom(createRoomDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRoom(@Args() updateRoomDto: UpdateRoomDto): Promise<Boolean> {
    try {
      await this.roomService.updateRoom(updateRoomDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
