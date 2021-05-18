import { ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

export interface SmsModuleOptions {
  accessKey: string;
  secretKey: string;
  serviceId: string;
  from: string;
}

@ObjectType()
export class SmsOutput extends MutationOutput {}
