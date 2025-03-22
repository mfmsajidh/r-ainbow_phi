import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ProductRecommendation } from './entities/product-recommendation.entity';
import { ProductCatalogService } from '../../external/product-catalog/product-catalog.service';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(
    @InjectRepository(ProductRecommendation)
    private productRecommendationRepository: Repository<ProductRecommendation>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly productCatalogService: ProductCatalogService,
  ) {}

  /**
   * Get personalized product recommendations for a customer
   */
  async getRecommendationsForCustomer(
    customerId: string,
    count: number = 5,
  ): Promise<ProductRecommendation[]> {
    try {
      const cacheKey = `recommendations:${customerId}`;
      const cachedRecommendations =
        await this.cacheManager.get<ProductRecommendation[]>(cacheKey);

      if (cachedRecommendations && cachedRecommendations.length >= count) {
        this.logger.log(
          `Retrieved cached recommendations for customer ${customerId}`,
        );
        return cachedRecommendations.slice(0, count);
      }

      const recommendedProducts =
        await this.productCatalogService.getPersonalizedRecommendations(
          customerId,
          count,
        );

      const recommendations = await Promise.all(
        recommendedProducts.map(async (product) => {
          const discountedPrice = product.price - product.price * 0.15; // 15% off recommended products

          let recommendation =
            await this.productRecommendationRepository.findOne({
              where: { productId: product.id },
            });

          if (!recommendation) {
            recommendation = this.productRecommendationRepository.create({
              productId: product.id,
              productName: product.name,
              productDescription: product.description,
              productImageUrl: product.imageUrl,
              productPrice: product.price,
              discountedPrice,
              recommendationScore: product.score,
              isActive: true,
            });
          } else {
            recommendation.productName = product.name;
            recommendation.productDescription = product.description;
            recommendation.productImageUrl = product.imageUrl;
            recommendation.productPrice = product.price;
            recommendation.discountedPrice = discountedPrice;
            recommendation.recommendationScore = product.score;
            recommendation.isActive = true;
          }

          return this.productRecommendationRepository.save(recommendation);
        }),
      );

      await this.cacheManager.set(cacheKey, recommendations, this.CACHE_TTL);

      this.logger.log(
        `Generated ${recommendations.length} recommendations for customer ${customerId}`,
      );
      return recommendations;
    } catch (error) {
      this.logger.error(
        `Error getting recommendations for customer ${customerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Clear recommendations cache for a customer
   */
  async clearRecommendationsCache(customerId: string): Promise<void> {
    try {
      const cacheKey = `recommendations:${customerId}`;
      await this.cacheManager.del(cacheKey);
      this.logger.log(
        `Cleared recommendations cache for customer ${customerId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error clearing recommendations cache for customer ${customerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
