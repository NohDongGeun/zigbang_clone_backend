import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { Agency } from 'src/agency/entities/agency.entity';
import { Room } from 'src/rooms/entities/room.entity';

export enum Verify {
  no,
  checking,
  verified,
}

registerEnumType(Verify, { name: 'Verify' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  email: string;

  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsNumber()
  phone: string;

  @Column({ select: false })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: Verify, default: 0 })
  @Field(type => Verify)
  verified: Verify;

  @ManyToMany(() => Room, room => room.user)
  @JoinTable()
  @Field(type => [Room], { nullable: true })
  room?: Room[];

  @Column({ default: false })
  @Field(type => Boolean)
  isAgency: boolean;

  @OneToOne(type => Agency, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(type => Agency, { nullable: true })
  agency?: Agency;

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
