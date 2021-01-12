import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdatePasswordInput extends PickType(User, ['password']) {}

@ObjectType()
export class UpdatePasswordOutput extends MutationOutput {}
