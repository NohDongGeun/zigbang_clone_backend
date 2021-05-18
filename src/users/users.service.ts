import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/userProfile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyUserOutput } from './dtos/verify-user.dto';
import { MailService } from 'src/mail/mail.service';
import { PasswordEmailInput, PasswordEmailOutput } from './dtos/password-email.dto';
import { CreateVerifyInput, CreateVerifyOutput } from './dtos/create-verify.dto';
import { SmsService } from 'src/sms/sms.service';

import { FindZzimOutput } from './dtos/find-zzimRooms.dto';
import { FindPhoneOutput } from './dtos/find-phone.dto';
import { FindIdPhoneInput, FindIdPhoneOutput } from './dtos/findId-phone.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { CreateZzimInput, CreateZzimOutput } from './dtos/create-zzim.dto';
import { Agency } from 'src/agency/entities/agency.entity';
import { SendSmsInput, SendSmsOutput } from './dtos/send-sms.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verification: Repository<Verification>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    @InjectRepository(Agency) private readonly agencys: Repository<Agency>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  //회원가입
  async createAccount({ email, password, name }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      //이미 가입된 유저인지 검사
      const isUser = await this.users.findOne({ email });
      if (isUser) {
        return { ok: false, error: '이미 가입한 계정입니다' };
      }

      const user = await this.users.save(this.users.create({ email, password, name }));

      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch (error) {
      //make error
      return { ok: false, error: '계정을 생성할 수 없습니다' };
    }
  }
  //verify 생성
  async createVerify(userId: number, { phone }: CreateVerifyInput): Promise<CreateVerifyOutput> {
    try {
      const user = await this.users.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const isVerify = await this.verification.findOne({ user }, { relations: ['user'] });
      //이미 verify 가 있으면 삭제 후 다시 생성 해주기
      if (isVerify) {
        await this.verification.delete(isVerify.id);
      }
      //verify 생성
      const verify = await this.verification.save(
        this.verification.create({
          user,
          phone,
        }),
      );
      //sms 문자보내기
      const sms = await this.smsService.sendSMS(phone, `[EROOM] 인증번호는 ${verify.code} 입니다`);
      if (sms.ok === false) {
        return {
          ok: false,
          error: '잘못된 번호입니다.',
        };
      }
      verify.user.verified = 1;
      await this.users.save(verify.user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '잘못된 번호입니다.',
      };
    }
  }

  async findVerifyPhone(user: User): Promise<FindPhoneOutput> {
    try {
      //checking 중인 유저 찾기
      const isCheckingUser = await this.verification.findOne({ user }, { relations: ['user'] });
      if (!isCheckingUser) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      return {
        ok: true,
        phone: isCheckingUser.phone,
      };
    } catch (error) {
      return {
        ok: false,
        error: '잘못된 접근입니다.',
      };
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
      const user = await this.users.findOne({ id }, { relations: ['agency'] });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async zzimRooms(userId: number, { roomId }: CreateZzimInput): Promise<CreateZzimOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['room'] });
      const room = await this.rooms.findOne({ id: roomId });
      if (!user || !room) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const rooms = user.room.concat(room);
      await this.users.save({ ...user, room: rooms });
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

  async deleteZzimRooms(userId: number, { roomId }: CreateZzimInput): Promise<CreateZzimOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['room'] });
      const room = await this.rooms.findOne({ id: roomId });
      if (!user || !room) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      const newZzim = user.room.filter(data => data.id !== roomId);
      await this.users.save({ ...user, room: newZzim });
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

  //프로필 변경
  async editProfile(userId: number, { name, newPassword, password }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      if (name) {
        const user = await this.users.findOne({ id: userId });
        user.name = name;
        await this.users.save(user);
      }
      if (password) {
        const user = await this.users.findOne({ id: userId }, { select: ['id', 'password'] });
        console.log('비밀번호');
        const passwordCorrect = await user.checkPassword(password);
        if (!passwordCorrect) {
          return {
            ok: false,
            error: '현재 비밀번호를 확인해 주세요.',
          };
        }
        user.password = newPassword;
        await this.users.save(user);
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '업데이트 불가' };
    }
  }

  async verifyPhone(user: User, code: string): Promise<VerifyUserOutput> {
    try {
      // verify 찾은 후
      const verification = await this.verification.findOne({ user: user }, { relations: ['user'] });
      if (verification) {
        //성공시 코드 비교
        if (verification.code === code) {
          verification.user.verified = 2;
          verification.user.phone = verification.phone;
          await this.users.save(verification.user);
          await this.verification.delete(verification.id);
          return { ok: true };
        }
      }
      return { ok: false, error: '잘못된 코드입니다.' };
    } catch (error) {
      return { ok: false, error: '잘못된 코드입니다.' };
    }
  }

  async findPassword({ email }: PasswordEmailInput): Promise<PasswordEmailOutput> {
    try {
      const isUser = await this.users.findOne({ email }, { select: ['id', 'password', 'name', 'email'] });

      if (!isUser) {
        return { ok: false, error: '등록되지 않은 이메일입니다.' };
      }
      const exPassword = uuidv4();
      await this.editProfile(isUser.id, { password: exPassword });
      this.mailService.sendPasswordEmail(isUser.name, exPassword, isUser.email);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '등록되지 않은 이메일입니다.',
      };
    }
  }

  async findIdPhone({ phone }: FindIdPhoneInput): Promise<FindIdPhoneOutput> {
    try {
      const isUser = await this.users.findOne({ phone });
      if (!isUser) {
        return {
          ok: false,
          error: '등록되지 않은 유저입니다',
        };
      }
      const sms = await this.smsService.sendSMS(phone, `[직방클론] 아이디는 ${isUser.email} 입니다.`);
      if (sms.ok === false) {
        return {
          ok: false,
          error: '잘못된 번호입니다.',
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '잘못된 번호입니다.',
      };
    }
  }

  async findZzimRooms(userId: number): Promise<FindZzimOutput> {
    try {
      const user = await this.users.findOne({ id: userId }, { relations: ['room'] });
      if (!user) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      return {
        ok: true,
        rooms: user.room,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  async sendAgencySms(userId: number, { agencyId, roomId }: SendSmsInput): Promise<SendSmsOutput> {
    try {
      const user = await this.users.findOne({ id: userId });
      const agency = await this.agencys.findOne({ id: agencyId });
      if (!user || !agency) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      if (user.verified !== 2) {
        return {
          ok: false,
          error: '휴대폰 인증 후 이용해주세요.',
        };
      }
      const sms = await this.smsService.sendSMS(
        agency.phoneNum,
        `[EROOM] 등록번호 ${roomId} 로 문의가 왔습니다. 고객번호: ${user.phone}`,
      );
      if (sms.ok === false) {
        return {
          ok: false,
          error: '잘못된 번호입니다.',
        };
      }
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
