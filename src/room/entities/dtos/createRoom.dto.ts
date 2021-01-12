import { InputType, Field, OmitType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Room } from '../room.entity';

@InputType()
export class CreateRoomDto extends OmitType(Room, ['id'], InputType) {}
