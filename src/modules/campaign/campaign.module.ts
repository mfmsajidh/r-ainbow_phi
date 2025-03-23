import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [CustomersModule, ProductsModule, MailModule],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
