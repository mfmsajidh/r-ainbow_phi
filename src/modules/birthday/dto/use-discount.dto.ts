import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class UseDiscountDto {
  /**
   * The discount code to be used
   *
   * @example The discount code to be used
   */
  @IsString()
  @IsNotEmpty()
  discountCode: string;

  /**
   * The order ID to apply the discount to
   *
   * @example 550e8400-e29b-41d4-a716-446655440000
   */
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  /**
   * The total amount of the order
   *
   * @example 100.50
   * @optional
   */
  @IsNumber()
  @Min(0)
  @IsOptional()
  orderAmount?: number;

  /**
   * Additional notes for the discount usage
   *
   * @example Used during checkout
   * @optional
   */
  @IsString()
  @IsOptional()
  notes?: string;
}
