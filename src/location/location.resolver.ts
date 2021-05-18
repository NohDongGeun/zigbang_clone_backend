import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateLocationInput, CreateLocationOutput } from './dtos/create-location.dto';
import { FindLocationInput, FindLocationOutput } from './dtos/find-location.dto';
import { FindLocationRoomInput, FindLocationRoomOutput } from './dtos/location_room.dto';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

@Resolver(of => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(returns => CreateLocationOutput)
  createLocation(@Args('input') createLocationInput: CreateLocationInput) {
    // return this.locationService.createLocation(createLocationInput)
  }

  @Mutation(returns => FindLocationOutput)
  findLocation() {
    return this.locationService.findLocation();
  }

  @Mutation(returns => FindLocationOutput)
  filteredLocation(@Args('input') findLocationInput: FindLocationInput): Promise<FindLocationOutput> {
    return this.locationService.filteredLocation(findLocationInput);
  }

  // @Query(returns => FindLocationRoomOutput)
  // findLocationRoom(@Args('input') findLocationRoomInput: FindLocationRoomInput): Promise<FindLocationRoomOutput> {
  //   return this.locationService.findLocationRoom(findLocationRoomInput);
  // }
}
