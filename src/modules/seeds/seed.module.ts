import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { SeedService } from './seed.service';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [CustomersModule, ProductsModule],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}
