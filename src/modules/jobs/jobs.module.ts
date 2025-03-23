import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignModule } from '../campaign/campaign.module';
import { MailModule } from '../mail/mail.module';
import { JobsProcessor } from './jobs.processor';
import { BirthdayScheduler } from './birthday.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'birthday-emails',
    }),
    CampaignModule,
    MailModule,
  ],
  providers: [JobsProcessor, BirthdayScheduler],
})
export class JobsModule {}
