import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}

  sign(payload: object): string {
    console.log(payload);
    return jwt.sign(payload, this.options.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
