import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getBirthdayCampaignContent(email: string) {
    const customer = await this.customersService.findOne(email);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const today = new Date();
    const birthdayThisYear = setYear(new Date(customer.birthday), today.getFullYear());
    const diff = differenceInCalendarDays(birthdayThisYear, today);

    if (diff >= 0 && diff <= 7) {
      const products = await this.productService.getSuggestedProducts(customer.preferences);
      return { products };
    }

    return { message: 'No campaign currently active.' };
  }

  async runBirthdayCampaign() {
    const users = await this.customersService.findAll();
    const today = new Date();

    for (const user of users) {
      const birthdayThisYear = setYear(new Date(user.birthday), today.getFullYear());

      const diff = differenceInCalendarDays(birthdayThisYear, today);

      if (diff === 7) {
        const products = await this.productService.getSuggestedProducts(user.preferences);
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
