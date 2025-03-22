import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BirthdayCampaign } from '../birthday/entities/birthday-campaign.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send birthday email with discount code and product recommendations
   */
  async sendBirthdayEmail(
    campaign: BirthdayCampaign,
    recommendations: any[],
  ): Promise<boolean> {
    try {
      const {
        customerName,
        customerEmail,
        discountCode,
        discountPercentage,
        campaignEndDate,
      } = campaign;

      const formattedEndDate = campaignEndDate.toLocaleDateString('en-UK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const templateData = {
        customerName,
        discountCode,
        discountPercentage,
        expiryDate: formattedEndDate,
        recommendations: recommendations.map((rec) => ({
          name: rec.productName,
          description: rec.productDescription,
          imageUrl: rec.productImageUrl,
          price: rec.productPrice,
          discountedPrice: rec.discountedPrice,
        })),
        appUrl: this.configService.get<string>('app.url'),
      };

      const result = await this.emailService.sendTemplateEmail({
        to: customerEmail,
        subject: `Happy Birthday ${customerName}! Your special gift is inside 🎁`,
        template: 'birthday-campaign',
        context: templateData,
      });

      this.logger.log(`Birthday email sent to ${customerEmail}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error sending birthday email to ${campaign.customerEmail}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
