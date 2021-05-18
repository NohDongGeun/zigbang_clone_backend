import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class SendSmsInput {
  @Field(type => Number)
  agencyId: number;

  @Field(type => Number)
  roomId: number;
}

@ObjectType()
export class SendSmsOutput extends MutationOutput {}
