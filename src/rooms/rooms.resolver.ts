import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Agency } from 'src/agency/entities/agency.entity';
import { AuthAgency } from 'src/auth/auth-agency.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthAgencyGuard } from 'src/auth/auth.agency.guard';
import { AuthUserGuard } from 'src/auth/auth.guard';
import { AuthJustGuard } from 'src/auth/auth.just.guard';
import { CreateLocationInput } from 'src/location/dtos/create-location.dto';
import { User } from 'src/users/entities/user.entity';
import { ChangeActiveInput, ChangeActiveOutput } from './dtos/change-active.dto';
import { CreateExpensesInput, CreateExpensesOutput } from './dtos/create-expenses.dto';
import { CreateOptionsInput, CreateOptionsOutput } from './dtos/create-options.dto';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { OptionsExpensesInput } from './dtos/createRoom-OpEx-dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dtos/delete-room.dto';
import { EditRoomInput, EditRoomOutput } from './dtos/edit-room.dto';
import { FindActiveRoomOutput } from './dtos/find-active-room.dto';
import { FindRoomsInput, FindRoomsOutput } from './dtos/find-rooms.dto';
import { PrivateRoomDetailInput, PrivateRoomDetailOutput } from './dtos/private-room-detail.dto';
import { RoomDetailInput, RoomDetailOutput } from './dtos/room-detail.dto';
import { ShowExpensesOutput } from './dtos/show-expenses.dto';
import { ShowOptionsOutput } from './dtos/show-options.dto';
import { Options } from './entities/options.entity';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(of => Room)
export class RoomResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthUserGuard)
  @Mutation(retuns => CreateRoomOutput)
  createRoom(
    @AuthUser() authUser: User,
    @Args('input') createRoomInput: CreateRoomInput,
    @Args('inputOpEx') optionsExpensesInput: OptionsExpensesInput,
    @Args('inputLocation') createLocationInput: CreateLocationInput,
  ): Promise<CreateRoomOutput> {
    return this.roomsService.createRoom(authUser.id, createRoomInput, optionsExpensesInput, createLocationInput);
  }

  @UseGuards(AuthUserGuard)
  @Mutation(returns => EditRoomOutput)
  editRoom(
    @AuthUser() authUser: User,
    @Args('input') editRoomInput: EditRoomInput,
    @Args('input2') optionsExpensesInput: OptionsExpensesInput,
    @Args('inputLocation') createLocationInput: CreateLocationInput,
  ): Promise<EditRoomOutput> {
    return this.roomsService.editRoom(authUser.id, editRoomInput, optionsExpensesInput, createLocationInput);
  }

  @UseGuards(AuthUserGuard)
  @Mutation(returns => DeleteRoomOutput)
  deleteRoom(@AuthUser() authUser: User, @Args('input') deleteRoomInput: DeleteRoomInput): Promise<DeleteRoomOutput> {
    return this.roomsService.deleteRoom(authUser.id, deleteRoomInput);
  }

  @Query(returns => RoomDetailOutput)
  roomDetail(@Args('input') roomDetailInput: RoomDetailInput): Promise<RoomDetailOutput> {
    return this.roomsService.roomDetail(roomDetailInput);
  }

  @UseGuards(AuthJustGuard)
  @Query(returns => PrivateRoomDetailOutput)
  privateRoomDetail(
    @AuthUser() authUser: User,
    @Args('input') roomDetailInput: PrivateRoomDetailInput,
  ): Promise<RoomDetailOutput> {
    return this.roomsService.privateRoomDetail(authUser.id, roomDetailInput);
  }

  @Mutation(returns => CreateOptionsOutput)
  createOptions(@Args('input') createOptionsInput: CreateOptionsInput): Promise<CreateOptionsOutput> {
    return this.roomsService.createOptions(createOptionsInput);
  }

  @Mutation(returns => CreateExpensesOutput)
  createExpenses(@Args('input') createExpensesInput: CreateExpensesInput): Promise<CreateExpensesOutput> {
    return this.roomsService.createExpenses(createExpensesInput);
  }

  @Mutation(returns => FindRoomsOutput)
  findRooms(@Args('input') findRoomsInput: FindRoomsInput): Promise<FindRoomsOutput> {
    return this.roomsService.findRooms(findRoomsInput);
  }

  @Query(returns => ShowOptionsOutput)
  showOptions(): Promise<ShowOptionsOutput> {
    return this.roomsService.showAllOptions();
  }

  @Query(returns => ShowExpensesOutput)
  showExpenses(): Promise<ShowExpensesOutput> {
    return this.roomsService.showAllExpenses();
  }

  @UseGuards(AuthJustGuard)
  @Query(returns => FindActiveRoomOutput)
  findActiveRooms(@AuthUser() authUser: User): Promise<FindActiveRoomOutput> {
    return this.roomsService.agencyRooms(authUser.id);
  }

  @UseGuards(AuthJustGuard)
  @Mutation(returns => ChangeActiveOutput)
  changeActive(
    @AuthUser() authUser: User,
    @Args('input') changeActiveInput: ChangeActiveInput,
  ): Promise<ChangeActiveOutput> {
    return this.roomsService.changeActive(authUser.id, changeActiveInput);
  }
}
