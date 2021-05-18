import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class FindPhoneOutput extends MutationOutput {
  @Field(type => String, { nullable: true })
  phone?: string;
}
