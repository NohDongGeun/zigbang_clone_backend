import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

  async sendEmail(subject: string, to: string, template: string, emailVars: EmailVar[]): Promise<boolean> {
    const form = new FormData();
    form.append('from', `직방 클론 <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`,
        },
        body: form,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  sendVerificationEmail(name: string, code: string, to: string): void {
    this.sendEmail('Verify Your Email', to, 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: name },
    ]);
  }
  sendPasswordEmail(name: string, password: string, to: string): void {
    this.sendEmail('Your Password is...', to, 'password-email', [
      { key: 'password', value: password },
      { key: 'username', value: name },
    ]);
  }
}
