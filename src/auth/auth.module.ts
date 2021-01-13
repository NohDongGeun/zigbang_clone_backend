import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthUserGuard } from './auth.guard';

@Module({})
export class AuthModule {}
