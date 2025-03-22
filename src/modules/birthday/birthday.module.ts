import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BirthdayController } from './birthday.controller';
import { BirthdayService } from './birthday.service';
import { BirthdayCampaign } from './entities/birthday-campaign.entity';
import { ProductRecommendation } from '../recommendation/entities/product-recommendation.entity';
import { CrmService } from '../../external/crm/crm.service';
import { DiscountService } from '../discount/discount.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { NotificationService } from '../notification/notification.service';
import { DiscountCode } from '../discount/entities/discount-code.entity';
import { ProductCatalogService } from '../../external/product-catalog/product-catalog.service';
import { EmailService } from '../email/email.service';
import { Product } from '../recommendation/entities/product.entity';
import { Category } from '../recommendation/entities/category.entity';
import { ProductTag } from '../recommendation/entities/product-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BirthdayCampaign,
      ProductRecommendation,
      DiscountCode,
      Product,
      Category,
      ProductTag,
    ]),
  ],
  controllers: [BirthdayController],
  providers: [
    BirthdayService,
    CrmService,
    DiscountService,
    RecommendationService,
    NotificationService,
    ProductCatalogService,
    EmailService,
  ],
})
export class BirthdayModule {}
