import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Room {
  @PrimaryColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  name: string;

  @Column()
  @Field(type => String)
  owner: string;

  @Column()
  @Field(type => String)
  position: String;
}
