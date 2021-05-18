import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verification.entity';

@ObjectType()
export class CreateVerifyOutput extends MutationOutput {
  @Field(type => String, { nullable: true })
  code?: string;
}

@InputType()
export class CreateVerifyInput extends PickType(Verification, ['phone']) {}
