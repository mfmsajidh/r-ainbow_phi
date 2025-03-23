import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { CampaignController } from './campaign.controller';

@Module({
  imports: [CustomersModule, ProductsModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
