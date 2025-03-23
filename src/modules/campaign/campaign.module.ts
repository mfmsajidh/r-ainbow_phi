import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { CampaignController } from './campaign.controller';
import { QueueModule } from '../../common/modules/queue.module';

@Module({
  imports: [
    CustomersModule,
    ProductsModule,
    QueueModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
