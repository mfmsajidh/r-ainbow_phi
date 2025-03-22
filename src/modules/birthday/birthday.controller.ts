import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BirthdayService } from './birthday.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UseDiscountDto } from './dto/use-discount.dto';

@Controller('birthday-campaign')
export class BirthdayController {
  private readonly logger = new Logger(BirthdayController.name);

  constructor(private readonly birthdayService: BirthdayService) {}

  /**
   * Get active birthday campaign for the authenticated user
   * Used by the mobile app to display birthday offers
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getActiveCampaign(@CurrentUser() user: any) {
    try {
      const result = await this.birthdayService.getActiveCampaignForCustomer(
        user.id,
      );

      if (!result) {
        return {
          hasBirthdayCampaign: false,
        };
      }

      return {
        hasBirthdayCampaign: true,
        campaign: {
          customerName: result.campaign.customerName,
          discountCode: result.campaign.discountCode,
          discountPercentage: result.campaign.discountPercentage,
          expiresAt: result.campaign.campaignEndDate,
        },
        recommendations: result.recommendations.map((rec) => ({
          id: rec.productId,
          name: rec.productName,
          description: rec.productDescription,
          imageUrl: rec.productImageUrl,
          price: rec.productPrice,
          discountedPrice: rec.discountedPrice,
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching birthday campaign for user ${user.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Mark a discount code as used
   * Called by order service when a discount is applied
   */
  @Post('discount/:code/use')
  async useDiscountCode(
    @Param('code') code: string,
    @Body() useDiscountDto: UseDiscountDto,
  ) {
    try {
      const result = await this.birthdayService.markDiscountCodeAsUsed(
        code,
        useDiscountDto.orderId,
      );

      return {
        success: result,
        message: result
          ? 'Discount code applied successfully'
          : 'Failed to apply discount code',
      };
    } catch (error) {
      this.logger.error(
        `Error using discount code ${code}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validate a discount code
   * Called by checkout service to validate a discount code
   */
  @Get('discount/:code/validate')
  async validateDiscountCode(@Param('code') code: string) {
    try {
      return await this.birthdayService.validateDiscountCode(code);
    } catch (error) {
      this.logger.error(
        `Error validating discount code ${code}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
