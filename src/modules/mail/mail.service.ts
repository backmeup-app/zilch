import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import { default as formData } from 'form-data';
import * as path from 'path';
import { renderFile } from 'ejs';
import { ConfigService } from '../config/config.service';
import { User } from '../user/user.schema';

@Injectable()
export class MailService {
  private mailClient;

  constructor(private configService: ConfigService) {
    const mailgun = new (Mailgun as any)(formData);
    this.mailClient = mailgun.client({
      username: 'api',
      key: this.configService.get('MAILGUN_API_KEY'),
    });
  }

  async handleUserRegistered(user: User) {
    const mailParams = {
      to: user.email,
      subject: 'Backmeup: Verify Your Email',
    };
    await this.mail(mailParams, 'user.registered.ejs', { user });
  }

  mail(
    mailParams: { [key: string]: string },
    template: string,
    templateParams: { [key: string]: any },
  ) {
    const templatePath = this.generateTemplatePath(template);
    const params = this.generateTemplateParams(templateParams);
    renderFile(templatePath, params, (error, html) => {
      if (error) throw error;
      mailParams.from = this.configService.get('MAIL_FROM');
      mailParams.html = html;
      this.mailClient.create(this.configService.get('MAIL_DOMAIN'), mailParams);
    });
  }

  generateTemplatePath(template: string) {
    return path.join('src', 'utilities', 'templates', 'mail', template);
  }

  generateTemplateParams(params: { [key: string]: any }) {
    const appName = this.configService.get('APP_NAME');
    const clientUrl = this.configService.get('CLIENT_URL');
    return { appName, clientUrl, ...params };
  }
}
