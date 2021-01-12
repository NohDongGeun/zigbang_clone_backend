import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AgencyService } from 'src/agency/agency.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly agencyService: AgencyService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('u-jwt' in req.headers) {
      const token = req.headers['u-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.usersService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (error) {}
    }
    if ('a-jwt' in req.headers) {
      const token = req.headers['a-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const agency = await this.agencyService.findById(decoded['id']);
          req['agency'] = agency;
        }
      } catch (error) {}
    }
    next();
  }
}
