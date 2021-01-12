import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdatePasswordInput } from './dtos/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async createAccount({ email, password, platform }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      //이미 가입된 유저인지 검사
      const isUser = await this.users.findOne({ email });
      if (isUser) {
        return { ok: false, error: '이미 가입한 계정입니다' };
      }
      await this.users.save(this.users.create({ email, password, platform }));
      return { ok: true };
    } catch (error) {
      //make error
      return { ok: false, error: '계정을 생성할 수 없습니다' };
    }
  }

  //로그인
  async login({ email, password }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return { ok: false, error: '존재하지 않는 아이디 입니다' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: '비밀번호가 맞지 않습니다' };
      }
      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }
  //비밀번호 변경
  async updatePassword(userId: number, { password }: UpdatePasswordInput) {
    const user = await this.users.findOne(userId);
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }
}
