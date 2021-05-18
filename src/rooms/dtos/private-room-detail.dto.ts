import { ArgsType, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class PrivateRoomDetailInput {
  @Field(type => Number)
  roomId: number;
}

@ObjectType()
export class PrivateRoomDetailOutput extends MutationOutput {
  @Field(type => Room, { nullable: true })
  room?: Room;
}
