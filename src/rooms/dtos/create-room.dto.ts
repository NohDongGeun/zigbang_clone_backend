import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';
import { Options } from '../entities/options.entity';
import { Room } from '../entities/room.entity';

@InputType()
export class CreateRoomInput extends PickType(Room, [
  'isParking',
  'posibleMove',
  'supplyArea',
  'exclusiveArea',
  'floor',
  'buildingFloor',
  'address',
  'title',
  'expense',
  'content',
  'images',
  'roomType',
  'dealType',
  'rent',
  'deposit',
  's3Code',
  'secretAddress',
]) {}

@ObjectType()
export class CreateRoomOutput extends MutationOutput {}
