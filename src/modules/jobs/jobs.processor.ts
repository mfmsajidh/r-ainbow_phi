import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { BirthdayEmailJobData } from './interfaces/birthday-email-job-data.interface';

@Processor('birthday-emails')
export class JobsProcessor extends WorkerHost {
  private readonly logger = new Logger(JobsProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<BirthdayEmailJobData>): Promise<void> {
    const { email, discountCode, products } = job.data;

    try {
      await this.mailService.sendBirthdayEmail(email, discountCode, products);
      this.logger.log(`✅ Birthday email successfully sent to ${email}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`❌ Failed to send email to ${email}`, error.stack);
      } else {
        this.logger.error(`❌ Failed to send email to ${email}: ${String(error)}`);
      }
      throw error;
    }
  }
}
