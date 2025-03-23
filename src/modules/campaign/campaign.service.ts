import { Injectable, Logger } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuid } from 'uuid';
import { differenceInCalendarDays, setYear } from 'date-fns';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    @InjectQueue('birthday-emails') private emailQueue: Queue,
  ) {}

  async runBirthdayCampaign() {
    const users = await this.customersService.findAll();
    const today = new Date();

    for (const user of users) {
      const birthdayThisYear = setYear(new Date(user.birthday), today.getFullYear());

      const diff = differenceInCalendarDays(birthdayThisYear, today);

      if (diff === 7) {
        const products = await this.productService.getSuggestedProducts(
          user.preferences,
        );
        const discountCode = uuid();

        await this.emailQueue.add('send-birthday-email', {
          email: user.email,
          discountCode,
          products,
        });

        this.logger.log(`📩 Enqueued birthday email for ${user.email}`);
      }
    }
  }
}
