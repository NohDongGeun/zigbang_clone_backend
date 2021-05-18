import { Field, InputType, ObjectType, PickType, Float } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { DealType, RoomType } from 'src/rooms/entities/room.entity';
import { centerTypes, geometryTypes, Location } from '../entities/location.entity';

@InputType()
export class FindLocationInput {
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
}

@ObjectType()
export class FindLocationOutput extends MutationOutput {
  @Field(type => [Location], { nullable: true })
  locations?: Location[];
}
