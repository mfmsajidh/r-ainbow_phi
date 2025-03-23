import { Module } from '@nestjs/common';
import { CampaignModule } from '../campaign/campaign.module';
import { JobsProcessor } from './jobs.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { BirthdayScheduler } from './birthday.scheduler';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'birthday',
    }),
    CampaignModule,
  ],
  providers: [JobsProcessor, BirthdayScheduler],
})
export class JobsModule {}
