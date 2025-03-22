import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual, UpdateResult } from 'typeorm';
import { DiscountCode, DiscountStatus } from './entities/discount-code.entity';
import * as crypto from 'crypto';

@Injectable()
export class DiscountService {
  private readonly logger = new Logger(DiscountService.name);

  constructor(
    @InjectRepository(DiscountCode)
    private discountCodeRepository: Repository<DiscountCode>,
  ) {}

  /**
   * Generate a unique discount code for a customer
   */
  async generateDiscountCode(
    customerId: string,
    percentage: number,
    validFrom: Date,
    validUntil: Date,
  ): Promise<string> {
    try {
      const codeBase = `${customerId}-${Date.now()}`;
      const hash = crypto.createHash('md5').update(codeBase).digest('hex');

      const code = `BIRTHDAY-${hash.substring(0, 8).toUpperCase()}`;

      const discountCode = this.discountCodeRepository.create({
        code,
        customerId,
        percentage,
        validFrom,
        validUntil,
        status: DiscountStatus.ACTIVE,
      });

      await this.discountCodeRepository.save(discountCode);
      this.logger.log(
        `Generated discount code ${code} for customer ${customerId}`,
      );

      return code;
    } catch (error) {
      this.logger.error(
        `Error generating discount code for customer ${customerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validate a discount code
   */
  async validateDiscountCode(
    code: string,
  ): Promise<{ valid: boolean; discount?: number; message?: string }> {
    try {
      const discountCode = await this.discountCodeRepository.findOne({
        where: { code },
      });

      if (!discountCode) {
        return { valid: false, message: 'Invalid discount code' };
      }

      const now = new Date();

      if (discountCode.status !== DiscountStatus.ACTIVE) {
        return { valid: false, message: `Code already ${discountCode.status}` };
      }

      if (now < discountCode.validFrom || now > discountCode.validUntil) {
        return { valid: false, message: 'Code not valid at this time' };
      }

      return { valid: true, discount: discountCode.percentage };
    } catch (error) {
      this.logger.error(
        `Error validating discount code ${code}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Mark a discount code as used
   */
  async markDiscountCodeAsUsed(
    code: string,
    orderId: string,
  ): Promise<boolean> {
    try {
      const now = new Date();

      const result: UpdateResult = await this.discountCodeRepository.update(
        {
          code,
          status: DiscountStatus.ACTIVE,
          validFrom: LessThan(now),
          validUntil: MoreThanOrEqual(now),
        },
        {
          status: DiscountStatus.USED,
          usedAt: now,
          orderId,
        },
      );

      if (result.affected === 1) {
        this.logger.log(
          `Marked discount code ${code} as used for order ${orderId}`,
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Error marking discount code ${code} as used: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Mark expired discount codes
   * Called by a scheduled job
   */
  async markExpiredDiscountCodes(): Promise<number> {
    try {
      const now = new Date();

      const result: UpdateResult = await this.discountCodeRepository.update(
        {
          status: DiscountStatus.ACTIVE,
          validUntil: LessThan(now),
        },
        { status: DiscountStatus.EXPIRED },
      );

      this.logger.log(`Marked ${result.affected} expired discount codes`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error(
        `Error marking expired discount codes: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
