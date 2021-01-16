import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';
import { Options } from '../entities/options.entity';
import { CreateRoomInput } from './create-room.dto';

@InputType()
export class EditRoomInput extends PartialType(CreateRoomInput) {
  @Field(type => Number)
  roomId: number;
}

@ObjectType()
export class EditRoomOutput extends MutationOutput {}
