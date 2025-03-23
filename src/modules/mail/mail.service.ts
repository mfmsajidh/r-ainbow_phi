import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendBirthdayEmail(email: string, discountCode: string, products: any[]) {
    const source = fs.readFileSync('./src/mail/templates/birthday.hbs', 'utf8');
    const template = handlebars.compile(source);
    const html = template({ discountCode, products });

    await this.transporter.sendMail({
      from: this.configService.get<string>('email.user'),
      to: email,
      subject: '🎉 Your Birthday Discount!',
      html,
    });
  }
}
