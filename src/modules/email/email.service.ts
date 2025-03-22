import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly templatesDir: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE', true),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    this.templatesDir = path.join(process.cwd(), 'src/templates/emails');
  }

  /**
   * Compile a handlebars template with given context
   */
  private async compileTemplate(
    templateName: string,
    context: any,
  ): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

    try {
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      this.logger.error(
        `Failed to compile email template: ${templateName}`,
        error.stack,
      );
      throw new Error(`Failed to compile email template: ${templateName}`);
    }
  }

  /**
   * Send an email with the given options
   */
  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
    attachments?: any[];
  }): Promise<boolean> {
    try {
      const from = options.from || this.configService.get<string>('EMAIL_FROM');

      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments || [],
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error.stack);
      return false;
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
    from?: string;
    attachments?: any[];
  }): Promise<boolean> {
    try {
      const html = await this.compileTemplate(
        options.template,
        options.context,
      );

      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        from: options.from,
        attachments: options.attachments,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send template email to ${options.to}`,
        error.stack,
      );
      return false;
    }
  }
}
