import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/userProfile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async createAccount({ email, password, platform, name, phone }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      //이미 가입된 유저인지 검사
      const isUser = await this.users.findOne({ email });
      if (isUser) {
        return { ok: false, error: '이미 가입한 계정입니다' };
      }
      const user = await this.users.save(this.users.create({ email, password, platform, name, phone }));
      await this.verification.save(
        this.verification.create({
          user,
        }),
      );
      return { ok: true };
    } catch (error) {
      //make error
      return { ok: false, error: '계정을 생성할 수 없습니다' };
    }
  }

  //로그인
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email }, { select: ['id', 'password'] });
      if (!user) {
        return {
          ok: false,
          error: '잘못된 이메일 입니다',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호 입니다',
        };
      }
      const token = this.jwtService.sign({ id: user.id });
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
  //id로 유저 찾기
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }
  //프로필 변경
  async editProfile(userId: number, { name, phone, password }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (name) {
        user.name = name;
      }
      if (phone) {
        user.phone = phone;
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '업데이트 불가' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verification.findOne({ code }, { relations: ['user'] });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
