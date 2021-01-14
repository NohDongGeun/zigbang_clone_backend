import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Agency extends CoreEntity {
  @Column()
  @Field(type => String)
  name: string;

  @Column({ unique: true })
  @Field(type => Number)
  bNumber: number;

  @Column()
  @Field(type => String)
  agent: string;

  @Column()
  @Field(type => String)
  phoneNum: string;

  @Column()
  @Field(type => String)
  address: string;

  @Column({ unique: true })
  @Field(type => String)
  email: string;

  @Column({ select: false })
  @Field(type => String)
  password: string;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
