import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class IsAgencyInput {
  @Field(type => Number)
  roomId: number;
}

@ObjectType()
export class IsAgencyOutput extends MutationOutput {}
