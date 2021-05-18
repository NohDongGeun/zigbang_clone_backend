import { Field, InputType, ObjectType, PickType, Float } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { DealType, RoomType } from 'src/rooms/entities/room.entity';
import { centerTypes, geometryTypes, Location } from '../entities/location.entity';

@InputType()
export class FindLocationRoomInput {
  @Field(type => Number)
  dealType: number;

  @Field(type => Float)
  dist: number;

  @Field(type => [Float])
  coordinates: number[];

  @Field(type => Number)
  minDeposit: number;

  @Field(type => Number)
  maxDeposit: number;

  @Field(type => Number)
  minRent: number;

  @Field(type => Number)
  maxRent: number;

  @Field(type => Boolean)
  isRoofAndBase: boolean;

  @Field(type => Boolean)
  isGround: boolean;

  @Field(type => Number)
  roomType: number;

  @Field(type => Boolean)
  isParking: boolean;

  @Field(type => Number)
  page: number;
}

@ObjectType()
export class FindLocationRoomOutput extends MutationOutput {
  @Field(type => [Location], { nullable: true })
  locations?: Location[];

  @Field(type => Number, { nullable: true })
  page?: number;
}
