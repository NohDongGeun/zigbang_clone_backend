import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { GraphQLDirective } from 'graphql';
import { Room } from 'src/rooms/entities/room.entity';
import { getManager, Repository } from 'typeorm';
import { CreateLocationInput, CreateLocationOutput } from './dtos/create-location.dto';
import { FindLocationInput, FindLocationOutput } from './dtos/find-location.dto';
import { FindLocationRoomInput, FindLocationRoomOutput } from './dtos/location_room.dto';
import { geometryTypes, Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private readonly locations: Repository<Location>) {}

  async createLocation(lat: number, lon: number, room: Room): Promise<CreateLocationOutput> {
    try {
      console.log(room);

      await this.locations.query(`INSERT INTO Location values (ST_MakePoint(${lat},${lon}),${room})`);

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async findLocation(): Promise<FindLocationOutput> {
    try {
      const locations = await this.locations
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.room', 'room')
        .where(`ST_DWithin(point,ST_SetSRID(ST_Point(37::decimal,127::decimal),4326)::geography, 1000)`)
        .getMany();

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

  async filteredLocation({
    dealType,
    roomType,
    floorType,
    isParking,
    rent,
    deposit,
    dist,
    coordinates,
  }: FindLocationInput): Promise<FindLocationOutput> {
    try {
      let query = this.locations
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.room', 'room')
        .where(`location.point && ST_MakeEnvelope(${dist[0]},${dist[1]},${dist[2]},${dist[3]}, 4326)`)
        .andWhere('room.isActive= :isActive', { isActive: true });

      if (dealType === '전세' || dealType === '월세') {
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

      const locations = await query
        .andWhere('room.roomType= :roomType', { roomType })
        .andWhere(`room.rent BETWEEN ${rent[0]} AND ${rent[1]}`)
        .andWhere(`room.deposit BETWEEN ${deposit[0]} AND ${deposit[1]}`)
        .getMany();

      return {
        ok: true,
        locations,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
