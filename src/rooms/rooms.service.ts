import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from 'src/agency/entities/agency.entity';
import { CreateLocationInput } from 'src/location/dtos/create-location.dto';
import { Location } from 'src/location/entities/location.entity';
import { Repository } from 'typeorm';
import { CreateExpensesInput, CreateExpensesOutput } from './dtos/create-expenses.dto';
import { CreateOptionsInput, CreateOptionsOutput } from './dtos/create-options.dto';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { OptionsExpensesInput } from './dtos/createRoom-OpEx-dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dtos/delete-room.dto';
import { EditRoomInput, EditRoomOutput } from './dtos/edit-room.dto';
import { RoomDetailInput, RoomDetailOutput } from './dtos/room-detail.dto';
import { ShowExpensesOutput } from './dtos/show-expenses.dto';
import { ShowOptionsOutput } from './dtos/show-options.dto';
import { Expenses } from './entities/expense.entity';
import { Options } from './entities/options.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    @InjectRepository(Agency) private readonly agencys: Repository<Agency>,
    @InjectRepository(Options) private readonly options: Repository<Options>,
    @InjectRepository(Expenses) private readonly expenses: Repository<Expenses>,
    @InjectRepository(Location) private readonly location: Repository<Location>,
  ) {}
  //방 생성
  async createRoom(
    agency: Agency,
    createRoomInput: CreateRoomInput,
    { optionsIds, expensesIds }: OptionsExpensesInput,
    createLocationInput: CreateLocationInput,
  ): Promise<CreateRoomOutput> {
    try {
      const isAgency = await this.agencys.findOne({ id: agency.id });
      if (!isAgency) {
        return {
          ok: false,
        };
      }
      const options = await this.options.createQueryBuilder().whereInIds(optionsIds).getMany();
      const expenses = await this.expenses.createQueryBuilder().whereInIds(expensesIds).getMany();

      const newRoom = this.rooms.create({ ...createRoomInput, agency: isAgency, options, expenses });
      const room = await this.rooms.save(newRoom);
      await this.location.save(this.location.create({ ...createLocationInput, room }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  //방 수정
  async editRoom(
    agency: Agency,
    editRoomInput: EditRoomInput,
    { optionsIds, expensesIds }: OptionsExpensesInput,
  ): Promise<EditRoomOutput> {
    try {
      const room = await this.rooms.findOne(
        { id: editRoomInput.roomId },
        { relations: ['agency', 'options', 'expenses'] },
      );

      if (!room) {
        return {
          ok: false,
          error: '존재하지 않는 방입니다',
        };
      }

      if (agency.id !== room.agencyId) {
        return {
          ok: false,
          error: '잘못된 접근입니다',
        };
      }
      const options = await this.options.createQueryBuilder().whereInIds(optionsIds).getMany();
      const expenses = await this.expenses.createQueryBuilder().whereInIds(expensesIds).getMany();
      await this.rooms.save([
        {
          id: editRoomInput.roomId,
          ...editRoomInput,
          options,
          expenses,
        },
      ]);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  //방 삭제
  async deleteRoom(agency: Agency, { roomId }: DeleteRoomInput): Promise<DeleteRoomOutput> {
    try {
      const room = await this.rooms.findOne(roomId);
      if (!room) {
        return {
          ok: false,
          error: '존재하지 않는 방입니다',
        };
      }
      if (agency.id !== room.agencyId) {
        return {
          ok: false,
          error: '잘못된 접근입니다',
        };
      }
      await this.rooms.delete(roomId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  //방 정보
  async roomDetail({ roomId }: RoomDetailInput): Promise<RoomDetailOutput> {
    try {
      const room = await this.rooms.findOne(roomId, { relations: ['agency', 'options', 'expenses'] });
      if (!room) {
        return {
          ok: false,
          error: '없는 방입니다',
        };
      }
      return {
        ok: true,
        room,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createOptions({ name, img }: CreateOptionsInput): Promise<CreateOptionsOutput> {
    try {
      await this.options.save(this.options.create({ name, img }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createExpenses(createExpensesInput: CreateExpensesInput): Promise<CreateExpensesOutput> {
    try {
      await this.expenses.save(this.expenses.create({ ...createExpensesInput }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async showAllOptions(): Promise<ShowOptionsOutput> {
    try {
      const options = await this.options.find();
      return {
        ok: true,
        options,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async showAllExpenses(): Promise<ShowExpensesOutput> {
    try {
      const expenses = await this.expenses.find();
      return {
        ok: true,
        expenses,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
