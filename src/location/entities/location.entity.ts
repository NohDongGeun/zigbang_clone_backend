import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@InputType('locationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Location extends CoreEntity {
  @Column()
  @Field(type => Number)
  lat: number;

  @Column()
  @Field(type => Number)
  lag: number;

  @OneToOne(type => Room, { onDelete: 'CASCADE' })
  @JoinColumn()
  room: Room;
}
