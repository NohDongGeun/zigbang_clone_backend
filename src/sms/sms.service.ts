import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { SmsModuleOptions, SmsOutput } from './sms.interfaces';
import axios from 'axios';
import * as crypto from 'crypto';
import { getJSDocReturnType } from 'typescript';

@Injectable()
export class SmsService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: SmsModuleOptions) {}

  private makeSignature(): string {
    const message = [];
    const hmac = crypto.createHmac('sha256', this.options.secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = Date.now().toString();
    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${this.options.serviceId}/messages`);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(this.options.accessKey);

    const signature = hmac.update(message.join('')).digest('base64');

    return signature.toString();
  }

  async sendSMS(phoneNumber: string, content: string): Promise<SmsOutput> {
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      from: this.options.from, // 발신자 번호
      content,
      messages: [
        {
          to: phoneNumber, // 수신자 번호
        },
      ],
    };
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': this.options.accessKey,
        'x-ncp-apigw-signature-v2': this.makeSignature(),
      },
    };
    const ok = await axios
      .post(`https://sens.apigw.ntruss.com/sms/v2/services/${this.options.serviceId}/messages`, body, options)
      .then(async res => {
        // 성공 이벤트
        return true;
      })
      .catch(error => {
        return false;
      });
    return {
      ok,
    };
  }
}
