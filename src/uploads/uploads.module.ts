import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadsController } from './uploads.controller';
@Global()
@Module({
  controllers: [UploadsController],
})
export class UploadsModule {
  static forRoot(options): DynamicModule {
    return {
      module: UploadsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
