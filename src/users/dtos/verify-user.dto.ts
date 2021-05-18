import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verification.entity';

@ObjectType()
export class VerifyUserOutput extends MutationOutput {}

@InputType()
export class VerifyUserInput extends PickType(Verification, ['code']) {}
