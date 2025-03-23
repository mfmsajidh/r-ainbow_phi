import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDto extends PartialType(CreateCustomerDto) {
  /**
   * Customer's password
   *
   * @example string2A!
   */
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
