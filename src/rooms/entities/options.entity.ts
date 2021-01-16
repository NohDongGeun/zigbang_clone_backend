import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('OptionsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Options {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  name: string;

  @Column()
  @Field(type => String, { nullable: true })
  img: string;
}
