import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { AgencyProfileOutput } from './dtos/agency-profile.dto';
import { CreateAgencyInput } from './dtos/create-agency.dto';
import { EditAgencyProfileInput, EditAgencyProfileOutput } from './dtos/edit-profile.dto';
import { LoginAgencyInput, LoginAgencyOutput } from './dtos/login-agency.dto';
import { Agency } from './entities/agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency) private readonly agencys: Repository<Agency>,
    private readonly jwtService: JwtService,
  ) {}

  async createAgency(createAgencyInput: CreateAgencyInput) {
    try {
      const isAgency = await this.agencys.findOne({ email: createAgencyInput.email });
      if (isAgency) {
        return { ok: false, error: '이미 가입한 계정입니다' };
      }
      await this.agencys.save(this.agencys.create(createAgencyInput));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '계정을 생성할 수 없습니다',
      };
    }
  }

  async findById(id: number): Promise<AgencyProfileOutput> {
    try {
      const agency = await this.agencys.findOne({ id });
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

  async login({ email, password }: LoginAgencyInput): Promise<LoginAgencyOutput> {
    try {
      const agency = await this.agencys.findOne({ email }, { select: ['id', 'password'] });
      if (!agency) {
        return {
          ok: false,
          error: '잘못된 이메일 입니다',
        };
      }
      const passwordCorrect = await agency.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호 입니다',
        };
      }
      const token = this.jwtService.sign({ id: agency.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editProfile(
    agencyId: number,
    { phoneNum, address, name, password }: EditAgencyProfileInput,
  ): Promise<EditAgencyProfileOutput> {
    try {
      const agency = await this.agencys.findOne(agencyId);
      if (name) {
        agency.name = name;
      }
      if (phoneNum) {
        agency.phoneNum = phoneNum;
      }
      if (password) {
        agency.password = password;
      }
      if (address) {
        agency.address = address;
      }
      await this.agencys.save(agency);
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
}
