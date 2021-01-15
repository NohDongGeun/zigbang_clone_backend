import { ObjectType, InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Agency } from 'src/agency/entities/agency.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Expenses } from './expense.entity';
import { Options } from './options.entity';

enum RoomType {
  oneRoom,
  twoRoom,
  threeRoom,
  threeRoomPlus,
}

enum DealType {
  year,
  month,
}
registerEnumType(DealType, { name: 'DealType' });
registerEnumType(RoomType, { name: 'RoomType' });

@InputType('RoomInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Room extends CoreEntity {
  //주차여부
  @Column({ default: false })
  @Field(type => Boolean)
  isParking: boolean;

  //엘리베이터 여부
  @Column({ default: false })
  @Field(type => Boolean)
  isElevator: boolean;

  //가입한 입주일
  @Column()
  @Field(type => String)
  PosibleMove: string;

  //공급면적
  @Column()
  @Field(type => Number)
  supplyArea: number;

  //전용면적
  @Column()
  @Field(type => Number)
  exclusiveArea: number;

  //방향
  @Column()
  @Field(type => String)
  direction: string;

  //준공날짜
  @Column()
  @Field(type => String)
  completionDate: String;

  //층수
  @Column()
  @Field(type => String)
  floor: String;

  //건물층수
  @Column()
  @Field(type => String)
  buildingFloor: String;

  //주소
  @Column()
  @Field(type => String)
  address: String;

  //상세설명
  @Column()
  @Field(type => String)
  text: string;

  //이미지
  @Column()
  @Field(type => String)
  image: string;

  //옵션 항목
  //   @Column(type => Options)
  //   @Field(type => [Options], { nullable: true })
  //   options: Options[];

  //관리비 항목
  //   @Column(type => Expenses)
  //   @Field(type => [Expenses], { nullable: true })
  //   expenses: Expenses[];

  //구조
  @Column({ type: 'enum', enum: RoomType })
  @Field(type => RoomType)
  @IsEnum(RoomType)
  roomType: RoomType;

  //거래유형
  @Column({ type: 'enum', enum: DealType })
  @Field(type => DealType)
  @IsEnum(DealType)
  dealType: DealType;

  @Field(type => Agency)
  @ManyToOne(type => Agency, agency => agency.rooms, { onDelete: 'CASCADE' })
  agency: Agency;

  @RelationId((room: Room) => room.agency)
  agencyId: number;
}
