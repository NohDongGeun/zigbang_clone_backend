import { ArgsType, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class RoomDetailInput {
  @Field(type => Number)
  roomId: number;
  @Field(type => Number, { nullable: true })
  userId?: number;
}

@ObjectType()
export class RoomDetailOutput extends MutationOutput {
  @Field(type => Room, { nullable: true })
  room?: Room;

  @Field(type => Boolean, { nullable: true })
  like?: boolean;
}
