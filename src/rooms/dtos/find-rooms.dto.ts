import { Field, InputType, ObjectType, PickType, Float } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class FindRoomsInput {
  @Field(type => String)
  dealType: string;

  @Field(type => [Float])
  dist: number[];

  @Field(type => [Float])
  coordinates: number[];

  @Field(type => [Number])
  deposit: number[];

  @Field(type => [Number])
  rent: number[];

  @Field(type => String)
  floorType: string;

  @Field(type => String)
  roomType: string;

  @Field(type => Boolean)
  isParking: boolean;

  @Field(type => Number)
  page: number;
}

@ObjectType()
export class FindRoomsOutput extends MutationOutput {
  @Field(type => [Room])
  rooms?: Room[];
}
