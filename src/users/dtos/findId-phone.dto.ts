import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class FindIdPhoneInput {
  @Field(type => String)
  phone: string;
}

@ObjectType()
export class FindIdPhoneOutput extends MutationOutput {}
