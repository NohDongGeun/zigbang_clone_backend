import { Field, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { string } from 'joi';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(PickType(User, ['password', 'name'])) {
  @Field(type => String, { nullable: true })
  newPassword?: string;
}

@ObjectType()
export class EditProfileOutput extends MutationOutput {}
