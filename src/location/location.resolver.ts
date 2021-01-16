import { Resolver } from "@nestjs/graphql";
import { Location } from "./entities/location.entity";


@Resolver(of=>Location)
export class LocationResolver{
    
}
