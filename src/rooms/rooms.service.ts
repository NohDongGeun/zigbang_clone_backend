import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NumberAttributeValue } from 'aws-sdk/clients/clouddirectory';
import { Agency } from 'src/agency/entities/agency.entity';
import { CreateLocationInput } from 'src/location/dtos/create-location.dto';
import { Location } from 'src/location/entities/location.entity';
import { LocationService } from 'src/location/location.service';
import { User } from 'src/users/entities/user.entity';
import { Connection, createQueryBuilder, getConnection, getManager, Repository } from 'typeorm';
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
    @InjectRepository(Location) private readonly locations: Repository<Location>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly locationService: LocationService,
  ) {}
  //방 정보,location정보,options,expenses정보들 한번에 저장
  async createRoom(
    userId: number,
    createRoomInput: CreateRoomInput,
    { optionsIds, expensesIds }: OptionsExpensesInput,
    { lat, lon }: CreateLocationInput,
  ): Promise<CreateRoomOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      if (!user || !user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }

      const options = await this.options.createQueryBuilder().whereInIds(optionsIds).getMany();
      const expenses = await this.expenses.createQueryBuilder().whereInIds(expensesIds).getMany();
      const isGround = createRoomInput.floor >= 1 && createRoomInput.floor <= createRoomInput.buildingFloor;

      const newRoom = await this.rooms
        .createQueryBuilder()
        .insert()
        .into(Room)
        .values({
          point: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)`,
          isGround,
          ...createRoomInput,
          agency: user.agency,
        })
        .execute();
      const room = await this.rooms.findOne({ id: newRoom.identifiers[0].id });
      room.options = options;
      room.expenses = expenses;
      await this.rooms.save(room);

      await this.locations
        .createQueryBuilder()
        .insert()
        .into(Location)
        .values({ point: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)`, room: newRoom.identifiers[0].id })
        .execute();

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

  async findRooms({
    dealType,
    roomType,
    floorType,
    isParking,
    rent,
    deposit,
    dist,
    coordinates,
    page,
  }: FindRoomsInput): Promise<FindRoomsOutput> {
    try {
      //필터를 거쳐 지도 안에 있는 방들 구하기
      let query = this.rooms
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.agency', 'agency')
        .where(`room.point && ST_MakeEnvelope(${dist[0]},${dist[1]},${dist[2]},${dist[3]}, 4326)`)
        .andWhere('room.isActive= :isActive', { isActive: true });

      if (dealType === '전세' && '월세') {
        query.andWhere('room.dealType= :dealType', { dealType });
      }
      if (floorType === '반지하/옥탑') {
        query.andWhere('room.isGround= :isGround', { isGround: false });
      }
      if (floorType === '지상층') {
        query.andWhere('room.isGround= :isGround', { isGround: true });
      }
      if (isParking) {
        query.andWhere('room.isParking= :isParking', { isParking: true });
      }

      const rooms = await query
        .andWhere('room.roomType= :roomType', { roomType })
        .andWhere(`room.rent BETWEEN ${rent[0]} AND ${rent[1]}`)
        .andWhere(`room.deposit BETWEEN ${deposit[0]} AND ${deposit[1]}`)
        .orderBy('room.id', 'DESC')
        .take(10)
        .skip((page - 1) * 10)
        .getMany();

      return {
        ok: true,
        rooms,
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
    userId: number,
    editRoomInput: EditRoomInput,
    { optionsIds, expensesIds }: OptionsExpensesInput,
    { lat, lon }: CreateLocationInput,
  ): Promise<EditRoomOutput> {
    console.log(editRoomInput);
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });

      if (!user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
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

      if (user.agency.id !== room.agencyId) {
        return {
          ok: false,
          error: '잘못된 접근입니다',
        };
      }
      //options,expenses 찾기
      const options = await this.options.createQueryBuilder().whereInIds(optionsIds).getMany();
      const expenses = await this.expenses.createQueryBuilder().whereInIds(expensesIds).getMany();
      //이미지 정리
      let newImages = [];
      newImages.push(...room.images.concat(editRoomInput.images));
      if (editRoomInput.deleteImages) {
        for (let i = 0; i < editRoomInput.deleteImages.length; i++) {
          for (let v = 0; v < newImages.length; v++) {
            if (editRoomInput.deleteImages[i] === newImages[v]) {
              newImages.splice(v, 1);
            }
          }
        }
      }

      //방 업데이트
      const {
        isParking,
        posibleMove,
        supplyArea,
        exclusiveArea,
        floor,
        buildingFloor,
        address,
        title,
        expense,
        content,
        roomType,
        dealType,
        rent,
        deposit,
        s3Code,
      } = editRoomInput;
      const newRoom = await getConnection()
        .createQueryBuilder()
        .update(Room)
        .set({
          isParking,
          posibleMove,
          supplyArea,
          exclusiveArea,
          floor,
          buildingFloor,
          address,
          title,
          expense,
          content,
          roomType,
          dealType,
          rent,
          deposit,
          s3Code,
          images: [...newImages],
          point: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)`,
        })
        .where('id = :id', { id: editRoomInput.roomId })
        .updateEntity(true)
        .execute();
      //location 업데이트
      await getConnection()
        .createQueryBuilder()
        .update(Location)
        .set({ point: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)` })
        .where('room.id = :id', { id: room.id })
        .execute();
      //옵션 업데이트
      const updatedRoom = await this.rooms.findOne({ id: editRoomInput.roomId });
      updatedRoom.options = options;
      updatedRoom.expenses = expenses;
      await this.rooms.save(updatedRoom);

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
  async deleteRoom(userId: number, { roomId }: DeleteRoomInput): Promise<DeleteRoomOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      const room = await this.rooms.findOne(roomId);
      if (!room) {
        return {
          ok: false,
          error: '존재하지 않는 방입니다',
        };
      }
      if (user.agency.id !== room.agencyId) {
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
  async roomDetail({ roomId, userId }: RoomDetailInput): Promise<RoomDetailOutput> {
    try {
      const room = await this.rooms.findOne({ id: roomId }, { relations: ['options', 'agency', 'expenses', 'user'] });
      if (!room) {
        return {
          ok: false,
          error: '없는 방입니다',
        };
      }
      if (!userId) {
        return {
          ok: true,
          room,
          like: false,
        };
      }
      const isUserLike = Boolean(
        room.user.find(value => {
          return value.id == userId;
        }),
      );
      return {
        ok: true,
        room,
        like: isUserLike,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async privateRoomDetail(userId: number, { roomId }: PrivateRoomDetailInput): Promise<PrivateRoomDetailOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      const room = await this.rooms.findOne({ id: roomId }, { relations: ['agency'] });

      if (user.agency.id === room.agency.id) {
        const room = await this.roomDetail({ userId, roomId });
        if (room.ok) {
          return {
            ok: true,
            room: room.room,
          };
        }
      }
      return {
        ok: false,
        error: '잘못된 접근입니다.',
      };
    } catch (error) {
      return {
        ok: false,
        error: '잘못된 접근입니다.',
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

  async agencyRooms(userId: number): Promise<FindActiveRoomOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      const activeRooms = await this.rooms
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.agency', 'agency')
        .addSelect('')
        .where('agency.id = :id', { id: user.agency.id })
        .andWhere('room.isActive = :isActive', { isActive: true })
        .getMany();

      const unActiveRooms = await this.rooms
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.agency', 'agency')
        .addSelect('')
        .where('agency.id = :id', { id: user.agency.id })
        .andWhere('room.isActive = :isActive', { isActive: false })
        .getMany();
      if (!user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      return {
        ok: true,
        activeRooms,
        unActiveRooms,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async changeActive(userId: number, { roomId, active }: ChangeActiveInput): Promise<ChangeActiveOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      const room = await this.rooms.findOne({ id: roomId }, { relations: ['agency'] });
      if (!user || !user.agency || room.agency.id !== user.agency.id) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      room.isActive = active;
      await this.rooms.save(room);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '잘못된 접근입니다.',
      };
    }
  }
}
