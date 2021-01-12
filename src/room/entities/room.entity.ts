import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Room {
  @PrimaryColumn()
  @Field(type => Number)
  @IsNumber()
  id: number;

  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column()
  @Field(type => String)
  @IsString()
  owner: string;

  @Column()
  @Field(type => String)
  @IsString()
  position: String;
}
