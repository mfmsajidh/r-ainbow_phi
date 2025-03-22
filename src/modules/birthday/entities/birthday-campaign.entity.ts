import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductRecommendation } from '../../recommendation/entities/product-recommendation.entity';

export enum CampaignStatus {
  PENDING = 'pending',
  EMAIL_SENT = 'email_sent',
  VIEWED_IN_APP = 'viewed_in_app',
  DISCOUNT_USED = 'discount_used',
  EXPIRED = 'expired',
}

@Entity()
export class BirthdayCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'timestamp' })
  campaignStartDate: Date;

  @Column({ type: 'timestamp' })
  campaignEndDate: Date;

  @Column()
  discountCode: string;

  @Column({ type: 'decimal' })
  discountPercentage: number;

  @ManyToMany(() => ProductRecommendation)
  @JoinTable()
  recommendations: ProductRecommendation[];

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.PENDING,
  })
  status: CampaignStatus;

  @Column({ type: 'timestamp', nullable: true })
  emailSentDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  viewedInAppDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  discountUsedDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
