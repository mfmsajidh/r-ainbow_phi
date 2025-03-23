import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { faker } from '@faker-js/faker';
import { subYears, addDays } from 'date-fns';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Starting dynamic database seeding...');

    await this.seedCustomers(20);
    await this.seedProducts(30);

    this.logger.log('✅ Dynamic seeding completed successfully!');
  }

  private async seedCustomers(count: number) {
    for (let i = 0; i < count; i++) {
      const randomDaysFromToday = faker.number.int({ min: 0, max: 28 });
      let birthday = addDays(new Date(), randomDaysFromToday);

      const age = faker.number.int({ min: 18, max: 60 });
      birthday = subYears(birthday, age);

      await this.customersService.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password123!',
        birthday,
        preferences: faker.helpers.arrayElements(
          ['books', 'electronics', 'fashion', 'sports', 'beauty'],
          { min: 1, max: 3 },
        ),
      });
    }
    this.logger.log(`👥 Created ${count} customers with realistic birthdays.`);
  }

  private async seedProducts(count: number) {
    const categories = ['books', 'electronics', 'fashion', 'sports', 'beauty'];
    for (let i = 0; i < count; i++) {
      await this.productsService.create({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
      });
    }
    this.logger.log(`📦 Created ${count} products.`);
  }
}
