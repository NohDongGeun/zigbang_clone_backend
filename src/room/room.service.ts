import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './entities/dtos/createRoom.dto';
import { Args } from '@nestjs/graphql';
import { UpdateRoomDto } from './entities/dtos/updateRoom.dto';

@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private readonly room: Repository<Room>) {}
  getAll(): Promise<Room[]> {
    return this.room.find();
  }
  createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = this.room.create(createRoomDto);
    return this.room.save(newRoom);
  }
  updateRoom({ id, data }: UpdateRoomDto) {
    return this.room.update(id, { ...data });
  }
}
