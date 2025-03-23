import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDto extends PartialType(CreateCustomerDto) {
  /**
   *  Customer's email
   *
   *  @example mfmsajidh@yahoo.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Customer's password
   *
   * @example Password123!
   */
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
