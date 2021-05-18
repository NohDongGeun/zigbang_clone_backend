import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verification.entity';

@ObjectType()
export class CreateZzimOutput extends MutationOutput {}

@InputType()
export class CreateZzimInput {
  @Field(type => Number)
  roomId: number;
}
