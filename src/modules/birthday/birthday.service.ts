import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import {
  BirthdayCampaign,
  CampaignStatus,
} from './entities/birthday-campaign.entity';
import { CrmService } from '../../external/crm/crm.service';
import { DiscountService } from '../discount/discount.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { NotificationService } from '../notification/notification.service';
import { ProductRecommendation } from '../recommendation/entities/product-recommendation.entity';

@Injectable()
export class BirthdayService {
  private readonly logger = new Logger(BirthdayService.name);

  constructor(
    @InjectRepository(BirthdayCampaign)
    private birthdayCampaignRepository: Repository<BirthdayCampaign>,
    @InjectRepository(ProductRecommendation)
    private productRecommendationRepository: Repository<ProductRecommendation>,
    private readonly crmService: CrmService,
    private readonly discountService: DiscountService,
    private readonly recommendationService: RecommendationService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Find customers with birthdays within the next 7 days
   * and create birthday campaigns for them
   */
  async processBirthdayCampaigns(): Promise<void> {
    try {
      this.logger.log('Processing birthday campaigns for upcoming birthdays');

      const customersWithUpcomingBirthdays =
        await this.crmService.getCustomersWithBirthdaysInNextWeek();

      for (const customer of customersWithUpcomingBirthdays) {
        await this.createBirthdayCampaign(customer);
      }

      this.logger.log(
        `Processed ${customersWithUpcomingBirthdays.length} birthday campaigns`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing birthday campaigns: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Create a birthday campaign for a customer
   */
  async createBirthdayCampaign(customer: any): Promise<BirthdayCampaign> {
    try {
      const existingCampaign = await this.birthdayCampaignRepository.findOne({
        where: {
          customerId: customer.id,
          campaignEndDate: MoreThanOrEqual(new Date()),
        },
      });

      if (existingCampaign) {
        this.logger.log(`Campaign already exists for customer ${customer.id}`);
        return existingCampaign;
      }

      const now = new Date();
      const campaignStartDate = new Date();
      const campaignEndDate = new Date(now);
      campaignEndDate.setDate(now.getDate() + 7);

      const discountPercentage = 20; // 20% discount
      const discountCode = await this.discountService.generateDiscountCode(
        customer.id,
        discountPercentage,
        campaignStartDate,
        campaignEndDate,
      );

      const recommendations =
        await this.recommendationService.getRecommendationsForCustomer(
          customer.id,
          5, // Get 5 recommended products
        );

      const recommendationEntities =
        await this.productRecommendationRepository.findBy({
          id: In(recommendations.map((r) => r.id)),
        });

      const birthdayCampaign = this.birthdayCampaignRepository.create({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        birthDate: customer.birthDate,
        campaignStartDate,
        campaignEndDate,
        discountCode,
        discountPercentage,
        recommendations: recommendationEntities,
        status: CampaignStatus.PENDING,
      });

      await this.birthdayCampaignRepository.save(birthdayCampaign);

      await this.notificationService.sendBirthdayEmail(
        birthdayCampaign,
        recommendations,
      );

      birthdayCampaign.status = CampaignStatus.EMAIL_SENT;
      birthdayCampaign.emailSentDate = new Date();
      await this.birthdayCampaignRepository.save(birthdayCampaign);

      this.logger.log(`Created birthday campaign for customer ${customer.id}`);
      return birthdayCampaign;
    } catch (error) {
      this.logger.error(
        `Error creating birthday campaign for customer ${customer.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get active birthday campaign for a customer
   */
  async getActiveCampaignForCustomer(customerId: string): Promise<{
    campaign: BirthdayCampaign;
    recommendations: ProductRecommendation[];
  } | null> {
    try {
      const campaign = await this.birthdayCampaignRepository.findOne({
        where: {
          customerId,
          campaignEndDate: MoreThanOrEqual(new Date()),
          campaignStartDate: LessThanOrEqual(new Date()),
          status: Not(CampaignStatus.EXPIRED),
        },
        relations: ['recommendations'],
      });

      if (!campaign) {
        return null;
      }

      if (campaign.status === CampaignStatus.EMAIL_SENT) {
        campaign.status = CampaignStatus.VIEWED_IN_APP;
        campaign.viewedInAppDate = new Date();
        await this.birthdayCampaignRepository.save(campaign);
      }

      return {
        campaign,
        recommendations: campaign.recommendations,
      };
    } catch (error) {
      this.logger.error(
        `Error getting active campaign for customer ${customerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Mark a discount code as used
   */
  async markDiscountCodeAsUsed(
    discountCode: string,
    orderId: string,
  ): Promise<boolean> {
    try {
      const result = await this.discountService.markDiscountCodeAsUsed(
        discountCode,
        orderId,
      );

      if (result) {
        const campaign = await this.birthdayCampaignRepository.findOne({
          where: { discountCode },
        });

        if (campaign) {
          campaign.status = CampaignStatus.DISCOUNT_USED;
          campaign.discountUsedDate = new Date();
          await this.birthdayCampaignRepository.save(campaign);
        }

        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Error marking discount code ${discountCode} as used: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validate a discount code
   * Called by the checkout service to validate a discount code
   */
  async validateDiscountCode(
    code: string,
  ): Promise<{ valid: boolean; discount?: number; message?: string }> {
    try {
      this.logger.log(`Validating discount code: ${code}`);

      return await this.discountService.validateDiscountCode(code);
    } catch (error) {
      this.logger.error(
        `Error validating discount code ${code}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
