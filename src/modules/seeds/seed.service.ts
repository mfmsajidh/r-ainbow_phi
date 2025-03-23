import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Seeding database...');

    await this.customersService.create({
      firstName: 'Saj',
      lastName: 'Sah',
      email: 'test@example.com',
      password: 'password',
      birthday: new Date(new Date().setDate(new Date().getDate() + 7)),
      preferences: ['books', 'electronics'],
    });

    await this.productsService.create({
      name: 'Noise Cancelling Headphones',
      category: 'electronics',
    });

    await this.productsService.create({
      name: 'Atomic Habits',
      category: 'books',
    });

    this.logger.log('✅ Seeding complete!');
  }
}
