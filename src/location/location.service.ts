import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private readonly locations: Repository<Location>) {}

  //그 지역사이의 모든방의 숫자 보여주기

  //그 지역사이의 방들 페이지네이션해서 보내주기

}
