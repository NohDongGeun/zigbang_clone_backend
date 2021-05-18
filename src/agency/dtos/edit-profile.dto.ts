import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Agency } from '../entities/agency.entity';

@InputType()
export class EditAgencyProfileInput extends PartialType(PickType(Agency, ['address', 'name', 'phoneNum', 'agent'])) {}

@ObjectType()
export class EditAgencyProfileOutput extends MutationOutput {}
