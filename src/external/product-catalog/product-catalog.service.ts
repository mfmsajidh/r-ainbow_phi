import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../modules/recommendation/entities/product.entity';

interface PersonalizedProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  score: number;
}

/**
 * Mock service to simulate integration with product catalog API
 */
@Injectable()
export class ProductCatalogService {
  private readonly logger = new Logger(ProductCatalogService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Generate local recommendations
   * Uses purchase history, product popularity and category preferences
   */
  async getPersonalizedRecommendations(
    customerId: string,
    count: number = 5,
  ): Promise<PersonalizedProductResponse[]> {
    try {
      /**
       * TODO Call an API or query a database to fetch customers
       * Returns mock data for demonstration purposes
       */
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .orderBy('product.viewCount', 'DESC')
        .take(count)
        .getMany();

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        imageUrl: product.imageUrl || '',
        score: Math.random() * 100, // Mock recommendation score
      }));
    } catch (error) {
      this.logger.error(
        `Error getting local recommendations for customer ${customerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
