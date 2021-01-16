import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Agency } from 'src/agency/entities/agency.entity';
import { AuthAgency } from 'src/auth/auth-agency.decorator';
import { AuthAgencyGuard } from 'src/auth/auth.agency.guard';
import { CreateLocationInput } from 'src/location/dtos/create-location.dto';
import { CreateExpensesInput, CreateExpensesOutput } from './dtos/create-expenses.dto';
import { CreateOptionsInput, CreateOptionsOutput } from './dtos/create-options.dto';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { OptionsExpensesInput } from './dtos/createRoom-OpEx-dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dtos/delete-room.dto';
import { EditRoomInput, EditRoomOutput } from './dtos/edit-room.dto';
import { RoomDetailInput, RoomDetailOutput } from './dtos/room-detail.dto';
import { ShowExpensesOutput } from './dtos/show-expenses.dto';
import { ShowOptionsOutput } from './dtos/show-options.dto';
import { Options } from './entities/options.entity';
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
    @Args('inputOpEx') optionsExpensesInput: OptionsExpensesInput,
    @Args('inputLocation') createLocationInput: CreateLocationInput,
  ): Promise<CreateRoomOutput> {
    return this.roomsService.createRoom(authAgency, createRoomInput, optionsExpensesInput,createLocationInput);
  }

  @UseGuards(AuthAgencyGuard)
  @Mutation(returns => EditRoomOutput)
  editRoom(
    @AuthAgency() authAgency: Agency,
    @Args('input') editRoomInput: EditRoomInput,
    @Args('input2') optionsExpensesInput: OptionsExpensesInput,
  ): Promise<EditRoomOutput> {
    return this.roomsService.editRoom(authAgency, editRoomInput, optionsExpensesInput);
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

  @Mutation(returns => CreateOptionsOutput)
  createOptions(@Args('input') createOptionsInput: CreateOptionsInput): Promise<CreateOptionsOutput> {
    return this.roomsService.createOptions(createOptionsInput);
  }

  @Mutation(returns => CreateExpensesOutput)
  createExpenses(@Args('input') createExpensesInput: CreateExpensesInput): Promise<CreateExpensesOutput> {
    return this.roomsService.createExpenses(createExpensesInput);
  }

  @Query(returns => ShowOptionsOutput)
  showOptions(): Promise<ShowOptionsOutput> {
    return this.roomsService.showAllOptions();
  }

  @Query(returns => ShowExpensesOutput)
  showExpenses(): Promise<ShowExpensesOutput> {
    return this.roomsService.showAllExpenses();
  }
}
