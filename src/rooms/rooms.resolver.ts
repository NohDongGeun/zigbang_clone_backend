import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Agency } from 'src/agency/entities/agency.entity';
import { AuthAgency } from 'src/auth/auth-agency.decorator';
import { AuthAgencyGuard } from 'src/auth/auth.agency.guard';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dtos/delete-room.dto';
import { EditRoomInput, EditRoomOutput } from './dtos/edit-room.dto';
import { RoomDetailInput, RoomDetailOutput } from './dtos/room-detail.dto';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(of => Room)
export class RoomResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthAgencyGuard)
  @Mutation(retuns => CreateRoomOutput)
  createRoom(
    @AuthAgency() authAgency: Agency,
    @Args('input') createRoomInput: CreateRoomInput,
  ): Promise<CreateRoomOutput> {
    return this.roomsService.createRoom(authAgency, createRoomInput);
  }

  @UseGuards(AuthAgencyGuard)
  @Mutation(returns => EditRoomOutput)
  editRoom(@AuthAgency() authAgency: Agency, @Args('input') editRoomInput: EditRoomInput): Promise<EditRoomOutput> {
    return this.roomsService.editRoom(authAgency, editRoomInput);
  }

  @UseGuards(AuthAgencyGuard)
  @Mutation(returns => DeleteRoomOutput)
  deleteRoom(
    @AuthAgency() authAgency: Agency,
    @Args('input') deleteRoomInput: DeleteRoomInput,
  ): Promise<DeleteRoomOutput> {
    return this.roomsService.deleteRoom(authAgency, deleteRoomInput);
  }

  @Query(returns => RoomDetailOutput)
  roomDetail(@Args() roomDetailInput: RoomDetailInput): Promise<RoomDetailOutput> {
    return this.roomsService.roomDetail(roomDetailInput);
  }
}
