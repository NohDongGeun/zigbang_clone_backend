import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class PasswordEmailOutput extends MutationOutput {}

@InputType()
export class PasswordEmailInput extends PickType(User, ['email']) {}
