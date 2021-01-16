import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Options } from '../entities/options.entity';

@InputType()
export class CreateOptionsInput extends PickType(Options, ['name', 'img']) {}

@ObjectType()
export class CreateOptionsOutput extends MutationOutput {}
