import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignService } from '../campaign/campaign.service';

@Injectable()
export class BirthdayScheduler {
  private readonly logger = new Logger(BirthdayScheduler.name);

  constructor(private campaignService: CampaignService) {}

  /**
   * Run daily at 1:00 AM to process upcoming birthdays
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    this.logger.log('🎯 Running daily birthday campaign check...');
    await this.campaignService.runBirthdayCampaign();
  }
}
