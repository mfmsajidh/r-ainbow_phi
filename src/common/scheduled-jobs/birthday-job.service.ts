import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BirthdayService } from '../../modules/birthday/birthday.service';
import { DiscountService } from '../../modules/discount/discount.service';

@Injectable()
export class BirthdayJobService {
  private readonly logger = new Logger(BirthdayJobService.name);

  constructor(
    private readonly birthdayService: BirthdayService,
    private readonly discountService: DiscountService,
  ) {}

  /**
   * Run daily at 1:00 AM to process upcoming birthdays
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async processBirthdayCampaigns() {
    this.logger.log('Starting scheduled job: Process Birthday Campaigns');
    try {
      await this.birthdayService.processBirthdayCampaigns();
      this.logger.log('Completed scheduled job: Process Birthday Campaigns');
    } catch (error) {
      this.logger.error(
        `Error in scheduled job: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Run daily at 2:00 AM to mark expired discount codes
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async markExpiredDiscountCodes() {
    this.logger.log('Starting scheduled job: Mark Expired Discount Codes');
    try {
      const count = await this.discountService.markExpiredDiscountCodes();
      this.logger.log(
        `Completed scheduled job: Marked ${count} expired discount codes`,
      );
    } catch (error) {
      this.logger.error(
        `Error in scheduled job: ${error.message}`,
        error.stack,
      );
    }
  }
}
