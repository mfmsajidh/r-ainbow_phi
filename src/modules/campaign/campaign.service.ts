import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { MailService } from '../mail/mail.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CampaignService {
  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private mailService: MailService,
  ) {}

  async runBirthdayCampaign() {
    const users = await this.customersService.findAll();
    const today = new Date();

    for (const user of users) {
      const birthday = new Date(user.birthday);
      birthday.setFullYear(today.getFullYear());

      const diff = Math.floor((birthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (diff === 7) {
        const products = await this.productService.getSuggestedProducts(user.preferences);
        const discountCode = uuid();

        await this.mailService.sendBirthdayEmail(user.email, discountCode, products);
      }
    }
  }
}
