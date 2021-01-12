import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRoomDto } from './createRoom.dto';

@InputType()
export class UpdateRoomInputType extends PartialType(CreateRoomDto) {}

@ArgsType()
export class UpdateRoomDto {
  @Field(type => Number)
  id: number;

  @Field(type => UpdateRoomInputType)
  data: UpdateRoomInputType;
}
