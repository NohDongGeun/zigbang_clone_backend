import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { isAbstractType } from 'graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEnum, IsNumber, IsString } from 'class-validator';

enum Platform {
  Kakao,
  Zigbang,
}
registerEnumType(Platform, { name: 'Platform' });

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

  @Column()
  @Field(type => Number)
  @IsNumber()
  phone: number;

  @Column({ type: 'enum', enum: Platform })
  @Field(type => Platform)
  @IsEnum(Platform)
  platform: Platform;

  @Column({ select: false })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({ default: false })
  @Field(type => Boolean)
  verified: boolean;

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
