import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Agency } from '../entities/agency.entity';

@InputType()
export class LoginAgencyInput extends PickType(Agency, ['email', 'password']) {}

@ObjectType()
export class LoginAgencyOutput extends MutationOutput {
  @Field(type => String, { nullable: true })
  token?: string;
}
