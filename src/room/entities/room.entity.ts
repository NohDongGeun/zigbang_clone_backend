import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(is => String)
  name: string;

  @Field(is => String)
  owner: string;

  @Field(is => String)
  position: String;
}
