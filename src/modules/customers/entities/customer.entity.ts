import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'jsonb', nullable: true })
  preferences: string[];

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column()
  password: string;

  constructor(partial: Partial<Customer> = {}) {
    Object.assign(this, partial);
  }
}
