import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private readonly room: Repository<Room>) {}
  getAll(): Promise<Room[]> {
    return this.room.find();
  }
}
