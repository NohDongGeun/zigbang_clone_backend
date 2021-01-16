import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';
import { Options } from '../entities/options.entity';
import { Room } from '../entities/room.entity';

@InputType()
export class CreateRoomInput extends PickType(Room, [
  'isParking',
  'isElevator',
  'PosibleMove',
  'supplyArea',
  'exclusiveArea',
  'direction',
  'completionDate',
  'floor',
  'buildingFloor',
  'address',
  'text',
  'image',
  'roomType',
  'dealType',
]) {}

@ObjectType()
export class CreateRoomOutput extends MutationOutput {}
