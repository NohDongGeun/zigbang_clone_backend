import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

@InputType('AgencyInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Agency extends CoreEntity {
  //부동산 이름
  @Column()
  @Field(type => String)
  name: string;

  //대표 공인중개사 이름
  @Column()
  @Field(type => String)
  agent: string;

  //대표 번호
  @Column()
  @Field(type => String)
  phoneNum?: string;

  //주소
  @Column()
  @Field(type => String)
  address: string;

  @OneToMany(type => Room, room => room.agency, { onDelete: 'CASCADE' })
  @Field(type => [Room], { nullable: true })
  rooms: Room[];

  @Column()
  @Field(type => String)
  image: string;
}
