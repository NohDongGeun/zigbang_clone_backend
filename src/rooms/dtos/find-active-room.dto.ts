import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';
import { Options } from '../entities/options.entity';
import { Room } from '../entities/room.entity';
import { CreateRoomInput } from './create-room.dto';

@ObjectType()
export class FindActiveRoomOutput extends MutationOutput {
  @Field(type => [Room], { nullable: true })
  activeRooms?: Room[];

  @Field(type => [Room], { nullable: true })
  unActiveRooms?: Room[];
}
