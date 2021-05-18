import { Field, InputType, ObjectType, PickType, Float } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Location } from '../entities/location.entity';

@InputType()
export class CreateLocationInput {
  @Field(type => Float)
  lat: number;

  @Field(type => Float)
  lon: number;
}

@ObjectType()
export class CreateLocationOutput extends MutationOutput {}
