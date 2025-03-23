import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async getSuggestedProducts(preferences: string[]) {
    return this.repo
      .createQueryBuilder('p')
      .where('p.category = ANY(:preferences)', { preferences })
      .getMany();
  }

  findAll() {
    return this.repo.find();
  }

  async create(data: Partial<Product>) {
    const p = this.repo.create(data);
    return this.repo.save(p);
  }
}
