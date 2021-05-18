import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { AgencyModule } from './agency/agency.module';
import { Agency } from './agency/entities/agency.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Options } from './rooms/entities/options.entity';
import { Expenses } from './rooms/entities/expense.entity';
import { Room } from './rooms/entities/room.entity';
import { LocationModule } from './location/location.module';
import { Location } from './location/entities/location.entity';
import { SmsModule } from './sms/sms.module';
import { UploadsModule } from './uploads/uploads.module';
import { JoinColumn } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //env 설정
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      //환경변수 유효성 검사
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAIL_APIKEY: Joi.string().required(),
        MAIL_DOMAIN: Joi.string().required(),
        MAIL_FROMEMAIL: Joi.string().required(),
        SMS_SERVICE_ID: Joi.string().required(),
        SMS_ACCESS_KEY: Joi.string().required(),
        SMS_SECRET_KEY: Joi.string().required(),
        SMS_FROM: Joi.string().required(),
        S3_ACCESS_KEY: Joi.string().required(),
        S3_SECRET_KEY: Joi.string().required(),
      }),
    }),
    //postgres 연결
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      entities: [User, Verification, Agency, Options, Expenses, Room, Location],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      context: ({ req }) => ({ user: req['user'], agency: req['agency'] }),
    }),
    UsersModule,
    CommonModule,
    JwtModule.forRoot({ privateKey: process.env.PRIVATE_KEY }),
    AuthModule,
    MailModule.forRoot({
      apiKey: process.env.MAIL_APIKEY,
      domain: process.env.MAIL_DOMAIN,
      fromEmail: process.env.MAIL_FROMEMAIL,
    }),
    SmsModule.forRoot({
      serviceId: process.env.SMS_SERVICE_ID,
      secretKey: process.env.SMS_SECRET_KEY,
      accessKey: process.env.SMS_ACCESS_KEY,
      from: process.env.SMS_FROM,
    }),
    AgencyModule,
    RoomsModule,
    LocationModule,
    SmsModule,
    UploadsModule.forRoot({
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL,
    });
  }
}
