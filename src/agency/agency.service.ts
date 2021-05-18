import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { JwtService } from 'src/jwt/jwt.service';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AgencyProfileOutput } from './dtos/agency-profile.dto';
import { CreateAgencyInput, CreateAgencyOutput } from './dtos/create-agency.dto';
import { DeleteAgencyOutput } from './dtos/delete-agency.dto';
import { EditAgencyProfileInput, EditAgencyProfileOutput } from './dtos/edit-profile.dto';
import { IsAgencyInput, IsAgencyOutput } from './dtos/isAgency.dto';
import { AgencyAllRoomsInput, AgencyAllRoomsOutput } from './dtos/show-agencyRoom-ALL.dto';
import { Agency } from './entities/agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency) private readonly agencys: Repository<Agency>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
  ) {}

  //부동산 계정 생성
  async createAgency(userId: number, createAgencyInput: CreateAgencyInput): Promise<CreateAgencyOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });

      if (!user) {
        return {
          ok: false,
          error: '로그인 후 이용하시기 바랍니다.',
        };
      }
      if (user.isAgency) {
        return {
          ok: false,
          error: '이미 가입된 부동산계정입니다',
        };
      }

      const newAgency = await this.agencys.save(this.agencys.create({ ...createAgencyInput, phoneNum: user.phone }));
      user.isAgency = true;
      user.agency = newAgency;
      await this.users.save(user);
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

  async agencyProfile(userId: number): Promise<AgencyProfileOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      if (!user || !user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const agency = user.agency;
      return {
        ok: true,
        agency,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async agencyEditProfile(userId: number, editAgencyProfileInput: EditAgencyProfileInput) {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      if (!user) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }

      await this.agencys.save([
        {
          id: user.agency.id,
          ...editAgencyProfileInput,
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
  // agency가 관리하는 방 전부 보여주기
  async showAgencyAllRoom(userId: number): Promise<AgencyAllRoomsOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      if (!user || !user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const agency = await this.agencys.findOne({ id: user.agency.id }, { relations: ['rooms'] });
      const rooms = agency.rooms;
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

  //agency delete
  async deleteAgency(userId: number): Promise<DeleteAgencyOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      if (!user || !user.agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const agency = await this.agencys.findOne({ id: user.agency.id }, { relations: ['rooms'] });
      user.isAgency = false;
      await this.users.save(user);
      await this.agencys.delete({ id: agency.id });
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

  async isAgency(userId: number, { roomId }: IsAgencyInput): Promise<IsAgencyOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['agency'] });
      const room = await this.rooms.findOne({ id: roomId }, { relations: ['agency'] });
      if (room.agencyId === user.agency.id) return { ok: true };
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
}
