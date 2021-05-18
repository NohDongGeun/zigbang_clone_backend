import { ArgsType, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Agency } from '../entities/agency.entity';

@ArgsType()
export class AgencyProfileInput {
  @Field(type => Number)
  userId: number;
}

@ObjectType()
export class AgencyProfileOutput extends MutationOutput {
  @Field(type => Agency, { nullable: true })
  agency?: Agency;
}
