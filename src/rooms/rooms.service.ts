import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from 'src/agency/entities/agency.entity';
import { Repository } from 'typeorm';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dtos/delete-room.dto';
import { EditRoomInput, EditRoomOutput } from './dtos/edit-room.dto';
import { RoomDetailInput, RoomDetailOutput } from './dtos/room-detail.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    @InjectRepository(Agency) private readonly agencys: Repository<Agency>,
  ) {}
  //방 생성
  async createRoom(agency: Agency, createRoomInput: CreateRoomInput): Promise<CreateRoomOutput> {
    try {
      const isAgency = await this.agencys.findOne({ id: agency.id });
      if (!isAgency) {
        return {
          ok: false,
        };
      }
      await this.rooms.save(this.rooms.create({ ...createRoomInput, agency: isAgency }));
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
  async editRoom(agency: Agency, editRoomInput: EditRoomInput): Promise<EditRoomOutput> {
    try {
      const room = await this.rooms.findOne({ id: editRoomInput.roomId }, { relations: ['agency'] });

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
      await this.rooms.save([
        {
          id: editRoomInput.roomId,
          ...editRoomInput,
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
      const room = await this.rooms.findOne(roomId, { relations: ['agency'] });
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
}
