import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Options } from '../entities/options.entity';

@InputType()
export class ChangeActiveInput {
  @Field(type => Number)
  roomId: number;

  @Field(type => Boolean)
  active: boolean;
}

@ObjectType()
export class ChangeActiveOutput extends MutationOutput {}
