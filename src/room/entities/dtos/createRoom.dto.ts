import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRoomDto {
  @Field(type => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(is => String)
  @IsString()
  owner: string;

  @Field(is => String)
  @IsString()
  position: String;
}
