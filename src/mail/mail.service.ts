import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

  private async sendEmail(subject: string, to: string, template: string, emailVars: EmailVar[]) {
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
    } catch (error) {
      console.log(error);
    }
  }
  sendVerificationEmail(name: string, code: string, to: string) {
    this.sendEmail('Verify Your Email', to, 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: name },
    ]);
  }
  sendPasswordEmail(name: string, password: string, to: string) {
    this.sendEmail('Your Password is...', to, 'password-email', [
      { key: 'password', value: password },
      { key: 'username', value: name },
    ]);
    console.log(name, password, to);
  }
}
