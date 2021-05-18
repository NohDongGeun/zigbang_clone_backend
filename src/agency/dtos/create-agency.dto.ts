import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Agency } from '../entities/agency.entity';

@InputType()
export class CreateAgencyInput extends PickType(Agency, ['name', 'address', 'agent', 'image']) {}

@ObjectType()
export class CreateAgencyOutput extends MutationOutput {}
