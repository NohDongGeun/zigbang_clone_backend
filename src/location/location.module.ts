import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService, LocationResolver],
  exports: [LocationService],
})
export class LocationModule {}
