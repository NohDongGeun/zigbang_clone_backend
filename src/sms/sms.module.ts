import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { SmsService } from './sms.service';
@Global()
@Module({})
export class SmsModule {
  static forRoot(options): DynamicModule {
    return {
      module: SmsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        SmsService,
      ],
      exports: [SmsService],
    };
  }
}
