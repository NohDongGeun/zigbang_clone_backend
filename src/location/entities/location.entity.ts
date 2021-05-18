import { Field, InputType, ObjectType, Float, Int } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { Geometry, GeoJSON } from 'geojson';
import { GraphQLSchemaBuilder } from '@nestjs/graphql/dist/graphql-schema.builder';
import { GraphQLObjectType, GraphQLScalarType, GraphQLSchema } from 'graphql';

@InputType('geometryType', { isAbstract: true })
@ObjectType()
export class geometryTypes {
  @Field(type => String, { nullable: true })
  type?: string;
  @Field(type => [Float])
  coordinates: number[];
}

@InputType('centerTypes', { isAbstract: true })
@ObjectType()
export class centerTypes {
  @Field(type => Number)
  id: Number;
  @Field(type => String)
  count: string;
  @Field(type => String)
  center: string;
}

@InputType('locationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Location extends CoreEntity {
  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Field(type => geometryTypes)
  point: Geometry;

  @OneToOne(type => Room, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(type => Room)
  room?: Room;
}
