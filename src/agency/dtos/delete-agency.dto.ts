import { ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class DeleteAgencyOutput extends MutationOutput {}
