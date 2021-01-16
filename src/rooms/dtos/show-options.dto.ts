import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Options } from '../entities/options.entity';

@ObjectType()
export class ShowOptionsOutput extends MutationOutput {
  @Field(type => [Options], { nullable: true })
  options?: Options[];
}
