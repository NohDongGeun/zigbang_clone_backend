import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('ExpenseInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Expenses {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column()
  @Field(type => String)
  name: string;

  @Column()
  @Field(type => String)
  img: string;
}
