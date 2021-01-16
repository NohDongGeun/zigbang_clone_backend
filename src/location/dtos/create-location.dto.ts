import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Location } from '../entities/location.entity';

@InputType()
export class CreateLocationInput extends PickType(Location, ['lat', 'lag']) {}
