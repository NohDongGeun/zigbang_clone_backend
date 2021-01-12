import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { isAbstractType } from 'graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEnum, IsString } from 'class-validator';

enum Platform {
  Kakao,
  Zigbang,
}
registerEnumType(Platform, { name: 'Platform' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  email: string;

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
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    if (this.password) {
      try {
        const ok = await bcrypt.compare(aPassword, this.password);
        return ok;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
