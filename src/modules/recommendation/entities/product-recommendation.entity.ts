import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  productDescription: string;

  @Column()
  productImageUrl: string;

  @Column({ type: 'decimal' })
  productPrice: number;

  @Column({ type: 'decimal', nullable: true })
  discountedPrice?: number;

  @Column({ type: 'decimal' })
  recommendationScore: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
