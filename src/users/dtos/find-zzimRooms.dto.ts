import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Room } from 'src/rooms/entities/room.entity';

@ObjectType()
export class FindZzimOutput extends MutationOutput {
  @Field(type => [Room], { nullable: true })
  rooms?: Room[];
}
