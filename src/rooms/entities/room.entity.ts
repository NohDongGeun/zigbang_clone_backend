import { ObjectType, InputType, Field, registerEnumType, Float, Int } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsEnum } from 'class-validator';
import { Geometry } from 'geojson';
import { Agency } from 'src/agency/entities/agency.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { geometryTypes } from 'src/location/entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, RelationId } from 'typeorm';
import { Expenses } from './expense.entity';
import { Options } from './options.entity';

export enum RoomType {
  oneRoom = '원룸',
  twoRoom = '투룸',
  threeRoom = '쓰리룸',
  threeRoomPlus = '포룸이상',
}

export enum DealType {
  year = '전세',
  month = '월세',
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

  //월세
  @Column({ nullable: true })
  @Field(type => Number)
  rent?: number;

  //보증금
  @Column()
  @Field(type => Number)
  deposit: number;

  //가입한 입주일
  @Column()
  @Field(type => String)
  posibleMove: string;

  //공급면적
  @Column()
  @Field(type => Number)
  supplyArea: number;

  //전용면적
  @Column()
  @Field(type => Number)
  exclusiveArea: number;

  //층수
  @Column()
  @Field(type => Number)
  floor: number;

  //지상층 여부
  @Column()
  @Field(type => Boolean)
  isGround: boolean;

  //건물층수
  @Column()
  @Field(type => Number)
  buildingFloor: number;

  //주소
  @Column()
  @Field(type => String)
  address: String;

  //풀 주소
  @Column()
  @Field(type => String)
  secretAddress: String;

  //제목
  @Column()
  @Field(type => String)
  title: string;

  //상세설명
  @Column()
  @Field(type => String)
  content: string;

  //이미지 더미
  @Column('text', { array: true })
  @Field(type => [String])
  images: string[];

  //aws s3 저장소이름
  @Column()
  @Field(type => String)
  s3Code: string;

  //좌표
  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Field(type => geometryTypes)
  point: Geometry;

  //옵션 항목
  @ManyToMany(type => Options, { onDelete: 'CASCADE' })
  @JoinTable()
  @Field(type => [Options], { nullable: true })
  options?: Options[];

  //관리비 항목
  @ManyToMany(type => Expenses, { onDelete: 'CASCADE' })
  @JoinTable()
  @Field(type => [Expenses], { nullable: true })
  expenses?: Expenses[];

  //관리비
  @Column()
  @Field(type => Number)
  expense: number;

  // 광고 중 여부
  @Column({ default: true })
  @Field(type => Boolean)
  isActive: boolean;

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

  @ManyToMany(() => User, user => user.room)
  @Field(type => [User], { nullable: true })
  user?: User[];
}
