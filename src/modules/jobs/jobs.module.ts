import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignModule } from '../campaign/campaign.module';
import { MailModule } from '../mail/mail.module';
import { JobsProcessor } from './jobs.processor';
import { BirthdayScheduler } from './birthday.scheduler';
import { QueueModule } from '../../common/modules/queue.module';

@Module({
  imports: [ScheduleModule.forRoot(), QueueModule, CampaignModule, MailModule],
  providers: [JobsProcessor, BirthdayScheduler],
})
export class JobsModule {}
