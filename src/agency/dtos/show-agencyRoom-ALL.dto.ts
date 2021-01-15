import { ArgsType, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { Agency } from '../entities/agency.entity';

@ArgsType()
export class AgencyAllRoomsInput {
  @Field(type => Number)
  id: number;
}

@ObjectType()
export class AgencyAllRoomsOutput extends MutationOutput {
  @Field(type => [Room], { nullable: true })
  rooms?: Room[];
}
